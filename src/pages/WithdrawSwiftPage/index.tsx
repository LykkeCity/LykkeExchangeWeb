import * as classnames from 'classnames';
import {Field, FieldProps, Form, Formik, FormikProps} from 'formik';
import {computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import Yup from 'yup';
import {RootStoreProps} from '../../App';
import {AmountInput} from '../../components/AmountInput';
import {AnalyticsEvent, Place} from '../../constants/analyticsEvents';
import {
  ROUTE_WITHDRAW_SWIFT_FAIL,
  ROUTE_WITHDRAW_SWIFT_SUCCESS
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {BalanceModel, OpStatus, WithdrawSwiftModel} from '../../models';
import {moneyFloor, subtraction} from '../../utils';

import './style.css';

interface WithdrawSwiftPageProps
  extends RootStoreProps,
    RouteComponentProps<any> {}

const BIC_REGEX = /^[a-zA-Z]{4}([a-zA-Z]{2})[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?$/;

export class WithdrawSwiftPage extends React.Component<WithdrawSwiftPageProps> {
  readonly assetStore = this.props.rootStore!.assetStore;
  readonly withdrawStore = this.props.rootStore!.withdrawStore;
  readonly walletStore = this.props.rootStore!.walletStore;
  readonly profileStore = this.props.rootStore!.profileStore;
  readonly socketStore = this.props.rootStore!.socketStore;
  readonly analyticsService = this.props.rootStore!.analyticsService;

  @observable operationId: string = '';
  @observable socketSubscriptionId: string = '';

  @computed
  get balance() {
    if (!this.walletStore.tradingWallets.length) {
      return 0;
    }

    const {assetId} = this.props.match.params;
    const asset = this.assetStore.getById(assetId)!;
    const balanceModel = this.walletStore.tradingWallets[0].balances.find(
      (assetBalance: BalanceModel) => {
        return assetBalance.assetId === assetId;
      }
    );

    if (balanceModel) {
      return moneyFloor(
        subtraction(balanceModel.balance, balanceModel.reserved),
        asset.accuracy
      );
    }

    return 0;
  }

  componentDidMount() {
    this.withdrawStore.fetchSwiftDefaultValues();
    this.walletStore.fetchWalletsData();

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
          <div className="withdraw-swift">
            <div className="withdraw-swift__title">Withdraw SWIFT</div>
            <div className="withdraw-swift__subtitle">
              {this.balance} {!!asset && asset!.name}
              <div className="withdraw-swift__subtitle-label">Available</div>
            </div>

            <Formik
              initialValues={this.withdrawStore.withdrawSwift}
              enableReinitialize
              validationSchema={Yup.object().shape({
                accHolderAddress: Yup.string().required(
                  requiredErrorMessage('Address')
                ),
                accHolderCity: Yup.string().required(
                  requiredErrorMessage('City')
                ),
                accHolderZipCode: Yup.string().required(
                  requiredErrorMessage('Zip code')
                ),
                accountName: Yup.string().required(
                  requiredErrorMessage('Full Name')
                ),
                accountNumber: Yup.string().required(
                  requiredErrorMessage('Account Number')
                ),
                amount: Yup.number()
                  .moreThan(0, requiredErrorMessage('Amount'))
                  .required(requiredErrorMessage('Amount')),
                bankName: Yup.string().required(
                  requiredErrorMessage('Name of the Bank')
                ),
                bic: Yup.string()
                  .required(requiredErrorMessage('SWIFT'))
                  .matches(BIC_REGEX, 'Invalid SWIFT')
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

  private getFee() {
    return this.withdrawStore.swiftFee;
  }

  private displayFee() {
    return !!this.withdrawStore.swiftFee;
  }

  private getWiredAmount(amount: number) {
    return amount - this.withdrawStore.swiftFee;
  }

  private displayWiredAmount(amount: number) {
    return (
      amount > 0 &&
      this.withdrawStore.withdrawSwift &&
      !!this.withdrawStore.swiftFee
    );
  }

  private handleGoBack = (e: any) => {
    e.preventDefault();
    this.analyticsService.track(
      AnalyticsEvent.GoBack(Place.WithdrawSwiftPage, 'button')
    );

    this.props.history.goBack();
  };

  private getSocketActions = (formikBag: any) => {
    const {setFieldError} = formikBag;
    return {
      [OpStatus.Accepted]: (errorCode?: string, errorMessage?: string) => {
        this.props.history.replace(ROUTE_WITHDRAW_SWIFT_SUCCESS);
      },
      [OpStatus.Confirmed]: (errorCode?: string, errorMessage?: string) => {
        this.props.history.replace(ROUTE_WITHDRAW_SWIFT_SUCCESS);
      },
      [OpStatus.Failed]: (errorCode?: string, errorMessage?: string) => {
        const validErrorCodes = ['LimitationCheckFailed', 'RuntimeProblem'];
        const BIC_ERROR = 'Bic';

        if (errorMessage === BIC_ERROR) {
          setFieldError('bic', 'Invalid BIC');
          return;
        }

        if (errorCode && validErrorCodes.indexOf(errorCode) > -1) {
          setFieldError('amount', errorMessage || 'Something went wrong.');
        } else {
          this.props.history.replace(ROUTE_WITHDRAW_SWIFT_FAIL);
        }
      }
    };
  };

  private listenSocket = async (formikBag: any) => {
    const {setSubmitting} = formikBag;
    const actions = this.getSocketActions(formikBag);

    const TIMEOUT_LIMIT = 10000;
    const OPERATIONS_TOPIC = 'operations';
    const socketTimeout = window.setTimeout(async () => {
      const operation = await this.withdrawStore.fetchWithdrawOperation(
        this.operationId
      );
      if (operation && operation.Status && actions[operation.Status]) {
        actions[operation.Status]();
      } else {
        this.socketStore.unsubscribe(
          OPERATIONS_TOPIC,
          this.socketSubscriptionId
        );
        this.withdrawStore.cancelWithdrawOperation(this.operationId);
        this.props.history.replace(ROUTE_WITHDRAW_SWIFT_FAIL);
      }
    }, TIMEOUT_LIMIT);

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
          this.socketStore.unsubscribe(
            OPERATIONS_TOPIC,
            this.socketSubscriptionId
          );
          window.clearTimeout(socketTimeout);
          setSubmitting(false);
          actions[status](errorCode, errorMessage);
        }
      }
    );
    this.socketSubscriptionId = subscription.id;
  };

  private handleSubmit = async (values: WithdrawSwiftModel, formikBag: any) => {
    const {assetId} = this.props.match.params;
    const {setFieldError, setSubmitting} = formikBag;

    if (values.amount > this.balance) {
      setFieldError('amount', 'Requested amount is more than balance');
      setSubmitting(false);
      return;
    }

    this.listenSocket(formikBag);
    this.operationId = await this.withdrawStore.sendWithdrawSwiftRequest(
      assetId,
      values
    );
  };

  private renderForm = (formikBag: FormikProps<WithdrawSwiftModel>) => {
    const {assetId} = this.props.match.params;
    const asset = this.assetStore.getById(assetId);
    const submitButtonText = formikBag.values.amount
      ? `Withdraw ${formikBag.values.amount} ${asset && asset.name}`
      : 'Withdraw';
    const dateText = new Date().toLocaleDateString();

    return (
      <Form className="withdraw-swift-form">
        <div className="separator" />
        <Field
          name="amount"
          // tslint:disable-next-line:jsx-no-lambda
          render={({field, form}: FieldProps<WithdrawSwiftPageProps>) => (
            <div
              className={classnames('form-group inline-form', {
                'has-error': form.errors[field.name] && form.touched[field.name]
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
                        onBlur={field.onBlur}
                        onFocus={(e: any) => {
                          formikBag.setFieldTouched(field.name, false);
                        }}
                        value={field.value || ''}
                        name={field.name}
                        decimalLimit={asset && asset.accuracy}
                      />
                      {form.errors[field.name] &&
                        form.touched[field.name] && (
                          <span className="help-block">
                            {form.errors[field.name]}
                          </span>
                        )}
                    </div>
                    {this.displayFee() && (
                      <div>
                        <div className="fee-info">
                          <span className="fee-info__label">Fee: </span>
                          <span className="fee-info__value">
                            {this.getFee()} {asset && asset.name}
                          </span>
                        </div>
                      </div>
                    )}
                    {this.displayWiredAmount(field.value) && (
                      <div>
                        <div className="fee-info">
                          <span className="fee-info__label">
                            Wired Amount:{' '}
                          </span>
                          <span className="fee-info__value">
                            {this.getWiredAmount(field.value)}{' '}
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
        <div className="separator" />

        <div className="withdraw-swift__form-parent-title">Account details</div>
        <div className="separator dense" />
        <div className="withdraw-swift__description">
          For the withdrawal of funds, the following account details will be
          used.
        </div>

        <Field
          name="bic"
          // tslint:disable-next-line:jsx-no-lambda
          render={({field, form}: FieldProps<WithdrawSwiftModel>) => (
            <div
              className={classnames('form-group', {
                'has-error': form.errors[field.name] && form.touched[field.name]
              })}
            >
              <label htmlFor={field.name} className="control-label">
                SWIFT
              </label>
              <div className="error-bar" />
              <input
                id={field.name}
                type="text"
                onChange={e => {
                  field.onChange(e);
                  if (e.target.value) {
                    const match = e.target.value.match(BIC_REGEX);
                    if (match) {
                      this.withdrawStore.fetchSwiftFee(assetId, match[1]);
                    } else {
                      this.withdrawStore.resetSwiftFee();
                    }
                  }
                }}
                onBlur={field.onBlur}
                onFocus={(e: any) => {
                  formikBag.setFieldTouched(field.name, false);
                }}
                className="form-control"
              />
              {form.errors[field.name] &&
                form.touched[field.name] && (
                  <span className="help-block">{form.errors[field.name]}</span>
                )}
            </div>
          )}
        />

        {this.renderField('bankName', 'Name of the Bank')}
        {this.renderField(
          'accountNumber',
          "Beneficiary's Account number (IBAN)"
        )}

        <div
          className="withdraw-swift__form-parent-title"
          style={{marginTop: '10px'}}
        >
          Account holder information
        </div>
        <div className="separator dense" />
        <div className="withdraw-swift__description">
          Withdrawals to third parties or anonymous accounts are not allowed,
          you can only make withdrawals to your own bank account.
        </div>
        {this.renderField('accountName', 'Full Name')}

        {this.renderField('accHolderAddress', 'Address line')}
        {this.renderField('accHolderCity', 'City')}
        {this.renderField('accHolderZipCode', 'Zip code')}

        <div className="form-group">
          <label htmlFor="paymentPurpose" className="control-label">
            Payment Purpose
          </label>
          <input
            id="paymentPurpose"
            type="text"
            disabled
            value={`Purchase of ${formikBag.values.amount} Lykke ${asset &&
              asset.name} as of ${dateText}`}
            className="form-control"
          />
          <label className="help-block">
            If a custom payment purpose is required please email{' '}
            <a className="link" href="mailto:support@lykke.com">
              support@lykke.com
            </a>{' '}
            with the details after submitting this request.
          </label>
        </div>

        <div className="withdraw-swift-form__actions">
          <input
            type="submit"
            value={submitButtonText}
            className="btn btn--primary"
            disabled={formikBag.isSubmitting || !formikBag.isValid}
          />
          <a href="#" onClick={this.handleGoBack} className="btn btn--flat">
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
      render={({field, form}: FieldProps<WithdrawSwiftModel>) => (
        <div
          className={classnames('form-group', {
            'has-error': form.errors[field.name] && form.touched[field.name]
          })}
        >
          <label htmlFor={field.name} className="control-label">
            {label}
          </label>
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
      )}
    />
  );
}

export default inject(STORE_ROOT)(observer(WithdrawSwiftPage));
