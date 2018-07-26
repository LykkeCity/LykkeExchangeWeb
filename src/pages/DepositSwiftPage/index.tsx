import * as classnames from 'classnames';
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikActions,
  FormikProps
} from 'formik';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import {RouteComponentProps} from 'react-router-dom';
import Yup from 'yup';
import {RootStoreProps} from '../../App';
import {AmountInput} from '../../components/AmountInput';
import ClientDialog from '../../components/ClientDialog';
import WalletTabs from '../../components/WalletTabs/index';
import {
  ROUTE_DEPOSIT_SWIFT_EMAIL_SENT,
  ROUTE_WALLETS_TRADING
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {DepositSwiftModel, DialogModel} from '../../models';
import {DialogConditionType} from '../../models/dialogModel';

import './style.css';

interface DepositSwiftPageProps
  extends RootStoreProps,
    RouteComponentProps<any> {}

export class DepositSwiftPage extends React.Component<DepositSwiftPageProps> {
  readonly assetStore = this.props.rootStore!.assetStore;
  readonly depositStore = this.props.rootStore!.depositStore;
  readonly dialogStore = this.props.rootStore!.dialogStore;

  componentDidMount() {
    const {assetId} = this.props.match.params;
    this.depositStore.fetchSwiftRequisites(assetId);

    const clientDialog = this.dialogStore.pendingDialogs.find(
      (dialog: DialogModel) =>
        dialog.conditionType === DialogConditionType.Predeposit
    );
    if (clientDialog) {
      clientDialog.visible = true;
    }

    window.scrollTo(0, 0);
  }

  render() {
    const {assetId} = this.props.match.params;
    const asset = this.assetStore.getById(assetId);
    const sendSwiftRequisites = this.depositStore.sendSwiftRequisites;
    const onSubmitSuccess = () => {
      this.props.history.replace(ROUTE_DEPOSIT_SWIFT_EMAIL_SENT);
    };
    const clientDialog = this.dialogStore.pendingDialogs.find(
      (dialog: DialogModel) =>
        dialog.conditionType === DialogConditionType.Predeposit
    );

    const requiredErrorMessage = (fieldName: string) =>
      `Field ${fieldName} should not be empty`;

    return (
      <div>
        <div className="container">
          {clientDialog && (
            <ClientDialog
              dialog={clientDialog}
              onDialogConfirm={this.handleDialogConfirm}
              onDialogCancel={this.handleDialogCancel}
            />
          )}
          <WalletTabs activeTabRoute={ROUTE_WALLETS_TRADING} />
          <div className="deposit-swift">
            <div className="deposit-swift__title">
              Deposit {!!asset && asset!.name}
            </div>
            <div className="deposit-swift__subtitle">Swift</div>
            <div className="deposit-swift__description">
              To deposit {!!asset && asset!.name} to your trading wallet please
              use the following bank account details.
            </div>
            <Formik
              initialValues={this.depositStore.swiftRequisites}
              enableReinitialize
              validationSchema={Yup.object().shape({
                accountNumber: Yup.string().required(),
                amount: Yup.number()
                  .moreThan(0, requiredErrorMessage('Amount'))
                  .required(requiredErrorMessage('Amount'))
              })}
              // tslint:disable-next-line:jsx-no-lambda
              onSubmit={async (
                values: DepositSwiftModel,
                {
                  setErrors,
                  setStatus,
                  setSubmitting
                }: FormikActions<DepositSwiftModel>
              ) => {
                await sendSwiftRequisites(assetId, values.amount);
                onSubmitSuccess();
              }}
              // tslint:disable-next-line:jsx-no-lambda
              render={(formikBag: FormikProps<DepositSwiftModel>) => (
                <Form className="deposit-swift-form">
                  <div className="separator" />
                  <Field
                    name="amount"
                    render={({field, form}: FieldProps<DepositSwiftModel>) => (
                      <div
                        className={classnames('form-group inline-form', {
                          'has-error': form.errors[field.name]
                        })}
                      >
                        <div className="row">
                          <div className="col-sm-4">
                            <label
                              htmlFor={field.name}
                              className="control-label"
                            >
                              Amount
                            </label>
                          </div>
                          <div className="col-sm-8">
                            <div className="input-group">
                              <div className="input-group-addon addon-text">
                                {asset && asset.name}
                              </div>
                              <div className="error-bar" />
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
                          </div>
                        </div>
                      </div>
                    )}
                  />

                  <div className="requisites">
                    {this.renderField('accountNumber', 'Account number')}
                    {this.renderField('accountName', 'Account name')}
                    {this.renderField('bankAddress', 'Bank address')}
                    {this.renderField('companyAddress', 'Company Address')}
                    {this.renderField('purposeOfPayment', 'Purpose of Payment')}
                    {this.renderField('bic', 'BIC')}
                    {this.renderField(
                      'correspondentAccount',
                      'Correspondent Account'
                    )}
                  </div>

                  <div className="deposit-swift-form__links">
                    <a
                      className="link"
                      href="https://www.lykke.com/terms_of_use"
                      target="_blank"
                    >
                      Terms of Use
                    </a>
                  </div>

                  <div className="deposit-swift-form__actions">
                    <input
                      type="submit"
                      value="Send to email"
                      className="btn btn--primary"
                      disabled={formikBag.isSubmitting || !formikBag.isValid}
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
              )}
            />
          </div>
        </div>
      </div>
    );
  }

  private renderField = (name: string, label: string) => (
    <div className="row">
      <div className="col-sm-12">
        <Field
          name={name}
          // tslint:disable-next-line:jsx-no-lambda
          render={({field, form}: FieldProps<DepositSwiftModel>) => (
            <div className="deposit-swift-form__form-group">
              <div>
                <label className="control-label">{label}</label>
                <div className="value">{field.value || 'Not available'}</div>
              </div>
              <div>
                <CopyToClipboard
                  text={field.value}
                  onCopy={text => this.handleCopy(text, form.setStatus)}
                >
                  <button className="btn btn--icon" type="button">
                    <i className="icon icon--copy_thin" />
                  </button>
                </CopyToClipboard>
                {field.value &&
                  form.status === field.value && (
                    <small className="copy-to-clipboard-message">Copied!</small>
                  )}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );

  private readonly handleCopy = (
    text: string,
    setStatus: (status?: any) => void
  ) => {
    if (text) {
      setStatus(text);
      setTimeout(() => {
        setStatus('');
      }, 2000);
    }
  };

  private handleDialogConfirm = async (dialog: DialogModel) => {
    if (dialog.isConfirmed) {
      const {assetId} = this.props.match.params;
      try {
        await this.dialogStore.submit(dialog);
      } finally {
        this.dialogStore.pendingDialogs = this.dialogStore.pendingDialogs.filter(
          (d: DialogModel) => dialog.id !== d.id
        );
        await this.depositStore.fetchSwiftRequisites(assetId);
      }
    }
  };

  private handleDialogCancel = async (dialog: DialogModel) => {
    this.dialogStore.pendingDialogs = this.dialogStore.pendingDialogs.filter(
      (d: DialogModel) => dialog.id !== d.id
    );
  };
}

export default inject(STORE_ROOT)(observer(DepositSwiftPage));
