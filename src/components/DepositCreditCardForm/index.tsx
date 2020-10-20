import * as classNames from 'classnames';
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
import {Link} from 'react-router-dom';
import Yup from 'yup';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {AssetModel, DepositCreditCardModel, GatewayUrls} from '../../models';
import {AmountInput} from '../AmountInput';
import {NumberFormat} from '../NumberFormat';

import './style.css';

export interface DepositCreditCardFormProps extends RootStoreProps {
  asset: AssetModel;
  onDisclaimerError: () => void;
  onMaxDepositError: (message: string) => void;
  onSubmitForm: (submitForm: () => void) => void;
  onSuccess: (gatewayUrls: GatewayUrls) => void;
  handleViewTermsOfUse?: () => void;
  handleGoBack?: (source: string) => void;
}

const DISCLAIMER_ERROR = 'User has pending disclaimer';
const MAX_DEPOSIT_ERROR = 'You can deposit up to';

export const DepositCreditCardForm: React.SFC<DepositCreditCardFormProps> = ({
  rootStore,
  asset,
  handleGoBack,
  onSubmitForm,
  onDisclaimerError,
  onMaxDepositError,
  handleViewTermsOfUse,
  onSuccess
}) => {
  const {
    depositStore: {fetchBankCardPaymentUrl, newDeposit: deposit, feePercentage}
  } = rootStore!;

  const requiredErrorMessage = (fieldName: string) =>
    `Field ${fieldName} should not be empty`;
  const DAILY_LIMIT_ERROR_MESSAGE = 'Credit card deposit limits reached.';

  const getTotalAmount = (amount: string) => {
    const fee = parseFloat(
      (parseFloat(amount) * feePercentage).toFixed(asset.accuracy)
    );
    return fee + parseFloat(amount);
  };
  return (
    <Formik
      initialValues={deposit}
      validationSchema={Yup.object().shape({
        amount: Yup.number()
          .moreThan(0, requiredErrorMessage('Amount'))
          .required(requiredErrorMessage('Amount'))
      })}
      // tslint:disable-next-line:jsx-no-lambda
      onSubmit={async (
        values: DepositCreditCardModel,
        {
          setStatus,
          setSubmitting,
          validateForm,
          submitForm
        }: FormikActions<DepositCreditCardModel>
      ) => {
        onSubmitForm(() => {
          setSubmitting(true);
          submitForm();
        });
        setStatus(null);
        deposit.update(values);
        try {
          const gatewayUrls = await fetchBankCardPaymentUrl(deposit);
          onSuccess(gatewayUrls);
        } catch (err) {
          if (err.message === DISCLAIMER_ERROR) {
            validateForm();
            onDisclaimerError();
          } else if (err.message.indexOf(MAX_DEPOSIT_ERROR) === 0) {
            onMaxDepositError(err.message);
          } else {
            setStatus(err.message);
          }
          setSubmitting(false);
        }
      }}
      // tslint:disable-next-line:jsx-no-lambda
      render={(formikBag: FormikProps<DepositCreditCardModel>) => (
        <Form className="deposit-credit-card-form">
          <div className="separator" />
          <Field
            name="amount"
            render={({field, form}: FieldProps<DepositCreditCardModel>) => (
              <div
                className={classNames('form-group inline-form', {
                  'has-error':
                    form.errors[field.name] && form.touched[field.name]
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
                        onChange={(e: any) => {
                          field.onChange(e);
                        }}
                        onFocus={(e: any) => {
                          formikBag.setFieldTouched(field.name, false);
                        }}
                        onBlur={field.onBlur}
                        value={field.value || ''}
                        name={field.name}
                        decimalLimit={asset && asset.accuracy}
                      />
                      {form.errors[field.name] &&
                        form.touched[field.name] && (
                          <span className="help-block">
                            {form.errors[field.name] ===
                            DAILY_LIMIT_ERROR_MESSAGE ? (
                              <span>
                                Credit card deposit limits reached.{' '}
                                <a
                                  className="link"
                                  href="https://www.lykke.com/cp/wallet-fees-and-limits"
                                  target="_blank"
                                >
                                  Read More
                                </a>
                              </span>
                            ) : (
                              form.errors[field.name]
                            )}
                          </span>
                        )}
                      {!!feePercentage &&
                        asset && (
                          <div>
                            <div className="fee-info">
                              <span className="fee-info__label"> Fee:</span>
                              <span className="fee-info__value">
                                {asset && asset.name}{' '}
                                <NumberFormat
                                  value={parseFloat(
                                    (field.value * feePercentage).toFixed(
                                      asset.accuracy
                                    )
                                  )}
                                  accuracy={asset.accuracy}
                                />
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

          <Field
            name={name}
            // tslint:disable-next-line:jsx-no-lambda
            render={({field, form}: FieldProps<any>) =>
              form.values.amount ? (
                <div className={classNames('form-group inline-form')}>
                  <div className="row field-row">
                    <div className="col-sm-4">
                      <label className="control-label">
                        Total <span className="total-hint">(amount+fee)</span>
                      </label>
                    </div>
                    <div className="col-sm-8 total-value">
                      {asset && asset.name}{' '}
                      <NumberFormat
                        value={getTotalAmount(form.values.amount)}
                        accuracy={asset.accuracy}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
          />
          <div className="deposit-credit-card-form__dislamier-text">
            Third-party credit card payments are not accepted. First credit card
            deposits may take up to 24 hours to be reflected in your portfolio
            balance.
          </div>
          <div
            className={classNames('deposit-credit-card-form__actions', {
              'has-error': formikBag.status
            })}
          >
            <input
              type="submit"
              value="Cash In"
              className="btn btn--primary"
              disabled={formikBag.isSubmitting}
            />
            {!!formikBag.status && (
              <div className="help-block">{formikBag.status}</div>
            )}
            <div>
              <Link
                to={ROUTE_WALLETS}
                className="btn btn--flat"
                onClick={() => handleGoBack && handleGoBack('button')}
              >
                Go back
              </Link>
            </div>
          </div>
        </Form>
      )}
    />
  );
};

export default inject(STORE_ROOT)(observer(DepositCreditCardForm));
