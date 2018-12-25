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
import {moneyCeil} from '../../utils';
import {AmountInput} from '../AmountInput';
import {FormSelect} from '../FormSelect';
import {NumberFormat} from '../NumberFormat';

import './style.css';

export interface DepositCreditCardFormProps extends RootStoreProps {
  asset: AssetModel;
  onDisclaimerError: () => void;
  onSubmitForm: (submitForm: () => void) => void;
  onSuccess: (gatewayUrls: GatewayUrls) => void;
  handleViewTermsOfUse?: () => void;
  handleGoBack?: (source: string) => void;
}

const DISCLAIMER_ERROR = 'User has pending disclaimer';

export const DepositCreditCardForm: React.SFC<DepositCreditCardFormProps> = ({
  rootStore,
  asset,
  handleGoBack,
  onSubmitForm,
  onDisclaimerError,
  handleViewTermsOfUse,
  onSuccess
}) => {
  const {
    catalogsStore: {countries},
    depositStore: {fetchBankCardPaymentUrl, newDeposit: deposit, feePercentage}
  } = rootStore!;
  const countryOptions = countries.map(c => ({
    label: c.name,
    value: c.id
  }));
  const requiredErrorMessage = (fieldName: string) =>
    `Field ${fieldName} should not be empty`;
  const DAILY_LIMIT_ERROR_MESSAGE = 'Credit card deposit limits reached.';

  const renderError = (field: any, form: any) =>
    form.errors[field.name] &&
    form.touched[field.name] && (
      <span className="help-block">{form.errors[field.name]}</span>
    );

  const renderField = (
    name: string,
    label: string,
    type = 'text',
    isDisabled = false
  ) => (
    <Field
      name={name}
      // tslint:disable-next-line:jsx-no-lambda
      render={({field, form}: FieldProps<DepositCreditCardModel>) => (
        <div
          className={classNames('form-group', {
            'has-error': form.errors[field.name] && form.touched[field.name]
          })}
        >
          <label htmlFor={field.name} className="control-label">
            {label}
          </label>
          <div className="error-bar" />
          <input
            id={field.name}
            type={type}
            {...field}
            className="form-control"
            disabled={isDisabled}
          />
          {renderError(field, form)}
        </div>
      )}
    />
  );

  return (
    <Formik
      initialValues={deposit}
      validationSchema={Yup.object().shape({
        address: Yup.string()
          .trim()
          .required(requiredErrorMessage('Address')),
        amount: Yup.number()
          .moreThan(0, requiredErrorMessage('Amount'))
          .required(requiredErrorMessage('Amount')),
        city: Yup.string()
          .trim()
          .required(requiredErrorMessage('City')),
        country: Yup.string()
          .trim()
          .required(requiredErrorMessage('Country')),
        firstName: Yup.string()
          .trim()
          .required(requiredErrorMessage('First Name')),
        lastName: Yup.string()
          .trim()
          .required(requiredErrorMessage('Last Name')),
        zip: Yup.string()
          .trim()
          .required(requiredErrorMessage('Zip'))
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
                          form.setFieldTouched(field.name);
                          field.onChange(e);
                        }}
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
                      {!!feePercentage && (
                        <div className="fee-label">
                          Fee: {asset && asset.name}{' '}
                          {asset && (
                            <NumberFormat
                              value={moneyCeil(field.value * feePercentage)}
                              accuracy={asset.accuracy}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
          <div className="separator" />

          <div className="row">
            <div className="col-sm-6">
              {renderField('firstName', 'First Name')}
            </div>

            <div className="col-sm-6">
              {renderField('lastName', 'Last Name')}
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <Field
                name="country"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames('form-group', {
                      'has-error':
                        form.errors[field.name] && form.touched[field.name]
                    })}
                  >
                    <label htmlFor={field.name} className="control-label">
                      Country
                    </label>
                    <div className="error-bar" />
                    <FormSelect options={countryOptions} {...field} />
                    {renderError(field, form)}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">{renderField('city', 'City')}</div>

            <div className="col-sm-6">{renderField('zip', 'ZIP')}</div>
          </div>

          <div className="row">
            <div className="col-sm-12">{renderField('address', 'Address')}</div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              {renderField('phone', 'Phone Number', 'tel', true)}
            </div>

            <div className="col-sm-6">
              {renderField('email', 'E-mail', 'email', true)}
            </div>
          </div>

          <div className="deposit-credit-card-form__links">
            <a
              className="link"
              href="https://www.lykke.com/terms_of_use"
              target="_blank"
              onClick={handleViewTermsOfUse}
            >
              Terms of Use
            </a>
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
            <Link
              to={ROUTE_WALLETS}
              className="btn btn--flat"
              onClick={() => handleGoBack && handleGoBack('button')}
            >
              Cancel and go back
            </Link>
          </div>
        </Form>
      )}
    />
  );
};

export default inject(STORE_ROOT)(observer(DepositCreditCardForm));
