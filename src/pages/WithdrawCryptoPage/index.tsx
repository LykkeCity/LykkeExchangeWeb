import * as classnames from 'classnames';
import {Field, FieldProps, Form, Formik, FormikProps} from 'formik';
import {computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import Yup from 'yup';
import {RootStoreProps} from '../../App';
import {AmountInput} from '../../components/AmountInput';
import {Banner} from '../../components/Banner';
import {
  ROUTE_CONFIRM_OPERATION_ID,
  ROUTE_SECURITY,
  ROUTE_WITHDRAW_CRYPTO_FAIL
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {BalanceModel, OpStatus, WithdrawCryptoModel} from '../../models';
import {moneyRound} from '../../utils';

import './style.css';

interface WithdrawCryptoPageProps
  extends RootStoreProps,
    RouteComponentProps<any> {}

export class WithdrawCryptoPage extends React.Component<
  WithdrawCryptoPageProps
> {
  readonly assetStore = this.props.rootStore!.assetStore;
  readonly withdrawStore = this.props.rootStore!.withdrawStore;
  readonly walletStore = this.props.rootStore!.walletStore;
  readonly profileStore = this.props.rootStore!.profileStore;
  readonly socketStore = this.props.rootStore!.socketStore;

  @observable operationId: string = '';

  @computed
  get balance() {
    if (!this.walletStore.tradingWallets.length) {
      return 0;
    }

    const {assetId} = this.props.match.params;
    const balanceModel = this.walletStore.tradingWallets[0].balances.find(
      (assetBalance: BalanceModel) => {
        return assetBalance.assetId === assetId;
      }
    );

    if (balanceModel) {
      return balanceModel.balance;
    }

    return 0;
  }

  componentDidMount() {
    const {assetId} = this.props.match.params;
    this.withdrawStore.fetchFee(assetId);
    this.withdrawStore.fetchWithdrawCryptoInfo(assetId);

    window.scrollTo(0, 0);
  }

  render() {
    const {assetId} = this.props.match.params;
    const asset = this.assetStore.getById(assetId);
    const requiredErrorMessage = (fieldName: string) =>
      `Field ${fieldName} should not be empty`;

    return (
      <div>
        <div className="container">
          <div className="withdraw-crypto">
            <Banner
              show={!this.profileStore.is2faEnabled}
              className="tfa-banner"
              title="Two-Factor Authentication"
              text={
                <span>
                  To ensure the security of withdrawals from Lykke, you need to
                  turn on Two-Factor Authentication. Find out more about it{' '}
                  <Link to={ROUTE_SECURITY}>here</Link>.
                </span>
              }
            />
            <div className="withdraw-crypto__title">Withdraw</div>
            <div className="withdraw-crypto__subtitle">
              {this.balance} {!!asset && asset!.name}
            </div>
            <div className="withdraw-crypto__description">
              Your wallet will not be charged until you authorize this
              transaction. Please ensure that the withdrawal address is a valid{' '}
              {asset && asset.name} address. Transfer to another blockchain will
              result in funds loss.
            </div>
            <Formik
              initialValues={this.withdrawStore.withdrawCrypto}
              enableReinitialize
              validationSchema={Yup.object().shape({
                addressExtension: this.withdrawStore.isAddressExtensionMandatory
                  ? Yup.string().required(
                      requiredErrorMessage(
                        this.withdrawStore.addressExtensionTitle
                      )
                    )
                  : Yup.string(),
                amount: Yup.number()
                  .moreThan(0, requiredErrorMessage('Amount'))
                  .required(requiredErrorMessage('Amount')),
                baseAddress: Yup.string().required(
                  requiredErrorMessage(this.withdrawStore.baseAddressTitle)
                )
              })}
              // tslint:disable-next-line:jsx-no-lambda
              onSubmit={this.handleSubmit}
              render={this.renderForm}
            />
          </div>
        </div>
      </div>
    );
  }

  private listenSocket = async (formikBag: any) => {
    const {setFieldError, setSubmitting} = formikBag;
    const actions = {
      [OpStatus.Accepted]: (errorCode?: string, errorMessage?: string) => {
        this.props.history.replace(
          ROUTE_CONFIRM_OPERATION_ID(this.operationId)
        );
      },
      [OpStatus.ConfirmationRequested]: (
        errorCode?: string,
        errorMessage?: string
      ) => {
        this.props.history.replace(
          ROUTE_CONFIRM_OPERATION_ID(this.operationId)
        );
      },
      [OpStatus.Failed]: (errorCode?: string, errorMessage?: string) => {
        const validErrorCodes = ['LimitationCheckFailed', 'RuntimeProblem'];
        const invalidAddressErrorMessages = [
          'Invalid address',
          'Invalid Destination Address. Please try again.'
        ];

        if (
          errorMessage &&
          invalidAddressErrorMessages.indexOf(errorMessage) > -1
        ) {
          setFieldError('baseAddress', 'Address is not valid');
          return;
        }

        if (errorCode && validErrorCodes.indexOf(errorCode) > -1) {
          setFieldError('amount', errorMessage || 'Something went wrong.');
        } else {
          this.props.history.replace(ROUTE_WITHDRAW_CRYPTO_FAIL);
        }
      }
    };

    const TIMEOUT_LIMIT = 10000;
    const socketTimeout = window.setTimeout(async () => {
      const operation = await this.withdrawStore.fetchWithdrawOperation(
        this.operationId
      );
      if (operation && operation.Status && actions[operation.Status]) {
        actions[operation.Status]();
      } else {
        this.props.history.replace(ROUTE_WITHDRAW_CRYPTO_FAIL);
      }
    }, TIMEOUT_LIMIT);

    const OPERATIONS_TOPIC = 'operations';
    const subscription = await this.socketStore.subscribe(
      OPERATIONS_TOPIC,
      (
        res: [
          {
            OperationId: string;
            Status: string;
            ErrorCode?: string;
            ErrorMessage?: string;
          }
        ]
      ) => {
        const {
          OperationId: id,
          Status: status,
          ErrorCode: errorCode,
          ErrorMessage: errorMessage
        } = res[0];

        if (id === this.operationId) {
          this.socketStore.unsubscribe(OPERATIONS_TOPIC, subscription.id);
          window.clearTimeout(socketTimeout);
          setSubmitting(false);
          actions[status](errorCode, errorMessage);
        }
      }
    );
  };

  private handleSubmit = async (
    values: WithdrawCryptoModel,
    formikBag: any
  ) => {
    const {assetId} = this.props.match.params;
    const {setFieldError, setSubmitting} = formikBag;

    if (this.getTotalAmount(values.amount) > this.balance) {
      setFieldError('amount', 'Requested amount is more than balance');
      setSubmitting(false);
      return;
    }

    const isValid = await this.withdrawStore.validateWithdrawCryptoRequest(
      assetId,
      values
    );

    if (isValid) {
      this.listenSocket(formikBag);
      this.operationId = await this.withdrawStore.sendWithdrawCryptoRequest(
        assetId,
        values
      );
    } else {
      setFieldError('baseAddress', 'Address is not valid');
      setSubmitting(false);
    }
  };

  private getFeeSize(amount: number) {
    const {assetId} = this.props.match.params;
    const asset = this.assetStore.getById(assetId);
    let fee = 0;

    if (this.withdrawStore.absoluteFee) {
      fee = this.withdrawStore.absoluteFee;
    }

    if (this.withdrawStore.relativeFee) {
      fee = this.withdrawStore.relativeFee * amount;
    }

    return moneyRound(fee, asset && asset.accuracy);
  }

  private getTotalAmount(amount: number) {
    const {assetId} = this.props.match.params;
    const asset = this.assetStore.getById(assetId);
    return moneyRound(
      Number(amount) + this.getFeeSize(amount),
      asset && asset.accuracy
    );
  }

  private renderForm = (formikBag: FormikProps<WithdrawCryptoModel>) => {
    const {assetId} = this.props.match.params;
    const asset = this.assetStore.getById(assetId);

    return (
      <Form className="withdraw-crypto-form">
        <div className="separator" />
        <Field
          name="amount"
          // tslint:disable-next-line:jsx-no-lambda
          render={({field, form}: FieldProps<WithdrawCryptoPageProps>) => (
            <div
              className={classnames('form-group inline-form', {
                'has-error': form.errors[field.name]
              })}
            >
              <div className="row row_amount">
                <div className="col-sm-4">
                  <label htmlFor={field.name} className="control-label">
                    Amount
                  </label>
                </div>
                <div className="col-sm-8">
                  <div className="input-group">
                    <div className="input-group-addon addon-text">
                      {asset && asset.name}
                    </div>
                    <div className="error-bar" />
                    <div className="amount-input">
                      <AmountInput
                        onChange={field.onChange}
                        value={field.value || ''}
                        name={field.name}
                        decimalLimit={asset && asset.accuracy}
                      />
                      {form.errors[field.name] && (
                        <span className="help-block">
                          {form.errors[field.name]}
                        </span>
                      )}
                    </div>
                    {field.value > 0 && (
                      <div>
                        <div className="fee-info">
                          <span className="fee-info__label">Fee:</span>
                          <span className="fee-info__value">
                            {this.getFeeSize(field.value)} {asset && asset.name}
                          </span>
                        </div>
                        <div className="fee-info">
                          <span className="fee-info__label">Total:</span>
                          <span className="fee-info__value">
                            {this.getTotalAmount(field.value)}{' '}
                            {asset && asset.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        />

        {this.renderField('baseAddress', this.withdrawStore.baseAddressTitle)}
        {this.withdrawStore.isAddressExtensionMandatory &&
          this.renderField(
            'addressExtension',
            this.withdrawStore.addressExtensionTitle
          )}

        <hr />

        <div className="withdraw-crypto-form__actions">
          <input
            type="submit"
            value="Submit"
            className="btn btn--primary"
            disabled={
              formikBag.isSubmitting ||
              !formikBag.isValid ||
              !this.profileStore.is2faEnabled
            }
          />
          <a
            href="#"
            onClick={this.props.history.goBack}
            className="btn btn--flat"
          >
            Cancel and go back
          </a>
        </div>
      </Form>
    );
  };

  private renderField = (name: string, label: string) => (
    <Field
      name={name}
      // tslint:disable-next-line:jsx-no-lambda
      render={({field, form}: FieldProps<WithdrawCryptoModel>) => (
        <div
          className={classnames('form-group inline-form', {
            'has-error': form.errors[field.name] && form.touched[field.name]
          })}
        >
          <div className="row field-row">
            <div className="col-sm-4">
              <label htmlFor={name} className="control-label">
                {label}
              </label>
            </div>
            <div className="col-sm-8">
              <div className="error-bar" />
              <input
                id={field.name}
                type="text"
                {...field}
                className="form-control"
              />
              {form.errors[field.name] &&
                form.touched[field.name] && (
                  <span className="help-block">{form.errors[field.name]}</span>
                )}
            </div>
          </div>
        </div>
      )}
    />
  );
}

export default inject(STORE_ROOT)(observer(WithdrawCryptoPage));
