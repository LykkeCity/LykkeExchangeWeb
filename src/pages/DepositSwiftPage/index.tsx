import * as classnames from 'classnames';
import {Field, FieldProps, Form, Formik, FormikProps} from 'formik';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import {RouteComponentProps} from 'react-router-dom';
import Yup from 'yup';
import {RootStoreProps} from '../../App';
import {AmountInput} from '../../components/AmountInput';
import WalletTabs from '../../components/WalletTabs/index';
import {AnalyticsEvent, Place} from '../../constants/analyticsEvents';
import {
  ROUTE_DEPOSIT_SWIFT_EMAIL_SENT,
  ROUTE_WALLETS_TRADING
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {DepositSwiftModel} from '../../models';

import Spinner from '../../components/Spinner';
import './style.css';

interface DepositSwiftPageProps
  extends RootStoreProps,
    RouteComponentProps<any> {}

const DEPOSIT_LIMIT_ERROR = 'DepositLimitReached';

export class DepositSwiftPage extends React.Component<DepositSwiftPageProps> {
  readonly assetStore = this.props.rootStore!.assetStore;
  readonly depositStore = this.props.rootStore!.depositStore;
  readonly analyticsService = this.props.rootStore!.analyticsService;

  componentDidMount() {
    const {assetId} = this.props.match.params;
    this.depositStore.fetchSwiftRequisites(assetId);
    window.scrollTo(0, 0);
  }

  render() {
    const {swiftRequisitesLoading} = this.depositStore;

    if (swiftRequisitesLoading) {
      return <Spinner />;
    }

    const {assetId} = this.props.match.params;
    const asset = this.assetStore.getById(assetId);
    const sendSwiftRequisites = this.depositStore.sendSwiftRequisites;
    const onSubmitSuccess = () => {
      this.analyticsService.track(
        AnalyticsEvent.FinishDeposit(Place.DepositSwiftPage, 'SWIFT', assetId)
      );

      this.props.history.replace(ROUTE_DEPOSIT_SWIFT_EMAIL_SENT);
    };
    const requiredErrorMessage = (fieldName: string) =>
      `Field ${fieldName} should not be empty`;

    return (
      <div>
        <div className="container">
          <WalletTabs activeTabRoute={ROUTE_WALLETS_TRADING} />
          <div className="deposit-swift">
            <div className="deposit-swift__title">
              Deposit {!!asset && asset!.name}
            </div>
            <div className="deposit-swift__subtitle">Swift</div>
            <div className="deposit-swift__description">
              To deposit {!!asset && asset!.name} to your Portfolio please use
              the following bank account details.
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
                {setFieldError, setSubmitting}
              ) => {
                try {
                  await sendSwiftRequisites(assetId, values.amount);
                  onSubmitSuccess();
                } catch (err) {
                  const error = JSON.parse(err.message).error;
                  if (error === DEPOSIT_LIMIT_ERROR) {
                    setSubmitting(false);
                    setFieldError('amount', 'SWIFT deposit limits reached.');
                    window.scrollTo(0, 0);
                  }
                }
              }}
              render={this.renderForm}
            />
          </div>
        </div>
      </div>
    );
  }

  private handleGoBack = (e: any) => {
    e.preventDefault();
    this.analyticsService.track(
      AnalyticsEvent.GoBack(Place.DepositSwiftPage, 'button')
    );

    this.props.history.goBack();
  };

  private renderForm = (formikBag: FormikProps<DepositSwiftModel>) => {
    const {assetId} = this.props.match.params;
    const asset = this.assetStore.getById(assetId);

    return (
      <Form className="deposit-swift-form">
        <div className="separator" />
        <Field
          name="amount"
          // tslint:disable-next-line:jsx-no-lambda
          render={({field, form}: FieldProps<DepositSwiftModel>) => (
            <div
              className={classnames('form-group inline-form', {
                'has-error': form.errors[field.name] && form.touched[field.name]
              })}
            >
              <div className="row">
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
                </div>
              </div>
            </div>
          )}
        />

        <div className="requisites">
          {this.renderField('bic', 'BIC (Swift)')}
          {this.renderField('accountNumber', 'Account number')}
          {this.renderField('accountName', 'Account name')}
          {this.renderField('bankAddress', 'Bank address')}
          {this.renderField(
            'correspondentAccount',
            'The correspondent (intermediary) bank'
          )}
          {this.renderField('companyAddress', 'Company address')}
          {this.renderField('purposeOfPayment', 'Purpose of payment')}
        </div>

        <div className="deposit-swift-form__actions">
          <div className="deposit-swift-form__dislamier-text">
            Sender’s bank details should match with the wallet account. Third
            party and/or anonymous payments cannot be accepted.
          </div>
          <input
            type="submit"
            value="Send to email"
            className="btn btn--primary mt-2"
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
    const HELPER_TEXT_TIMEOUT = 2000;

    if (text) {
      setStatus(text);
      setTimeout(() => {
        setStatus('');
      }, HELPER_TEXT_TIMEOUT);
    }
  };
}

export default inject(STORE_ROOT)(observer(DepositSwiftPage));
