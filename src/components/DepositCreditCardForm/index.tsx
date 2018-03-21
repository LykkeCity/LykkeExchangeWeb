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
import {FormattedNumber} from 'react-intl';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {AssetModel, DepositCreditCardModel} from '../../models';
import {roundMoney} from '../../utils';
import {AmountInput} from '../AmountInput';
import {FormSelect} from '../FormSelect';

import './style.css';

export interface DepositCreditCardFormProps extends RootStoreProps {
  asset: AssetModel;
  onSuccess: (failUrl: string, okUrl: string, paymentUrl: string) => void;
}

export const DepositCreditCardForm: React.SFC<DepositCreditCardFormProps> = ({
  rootStore,
  asset,
  onSuccess
}) => {
  const {
    appSettingsStore: {
      appSettings: {feeSettings: {bankCardsFeeSizePercentage}},
      countries
    },
    depositCreditCardStore: {fetchBankCardPaymentUrl, newDeposit: deposit}
  } = rootStore!;
  const countryOptions = countries.map(c => ({
    label: c.name,
    value: c.iso2
  }));

  return (
    <Formik
      initialValues={deposit}
      // tslint:disable-next-line:jsx-no-lambda
      validate={(values: DepositCreditCardModel) => {
        const errors = {} as any;

        if (!values.address) {
          errors.address = 'Field Address should not be empty';
        }
        if (!values.amount) {
          errors.amount = 'Field Amount should not be empty';
        }
        if (!values.city) {
          errors.city = 'Field City should not be empty';
        }
        if (!values.country) {
          errors.country = 'Field Country should not be empty';
        }
        if (!values.firstName) {
          errors.firstName = 'Field First Name should not be empty';
        }
        if (!values.lastName) {
          errors.lastName = 'Field Last Name should not be empty';
        }
        if (!values.zip) {
          errors.zip = 'Field ZIP should not be empty';
        }

        return errors;
      }}
      // tslint:disable-next-line:jsx-no-lambda
      onSubmit={async (
        values: DepositCreditCardModel,
        {
          setErrors,
          setStatus,
          setSubmitting
        }: FormikActions<DepositCreditCardModel>
      ) => {
        setStatus(null);
        deposit.update(values);
        try {
          const {failUrl, okUrl, paymentUrl} = await fetchBankCardPaymentUrl(
            deposit
          );
          onSuccess(failUrl, okUrl, paymentUrl);
        } catch (err) {
          if (err.field) {
            const errMessage = err.message.replace(asset.id, asset.name);
            setErrors({[err.field]: errMessage});
            (document.querySelector(
              `[name="${err.field}"]`
            ) as HTMLInputElement).focus();
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
                className={classNames(
                  'form-group inline-form',
                  form.errors[field.name] && 'has-error'
                )}
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
                      {AmountInput(
                        field.onChange,
                        field.value,
                        field.name,
                        asset && asset.accuracy
                      )}
                      {form.errors[field.name] && (
                        <span className="help-block">
                          {form.errors[field.name]}
                        </span>
                      )}
                      {!!bankCardsFeeSizePercentage && (
                        <div className="fee-label">
                          Fee: {asset && asset.name}{' '}
                          <FormattedNumber
                            value={roundMoney(
                              field.value * bankCardsFeeSizePercentage
                            )}
                            style="decimal"
                            maximumFractionDigits={asset && asset.accuracy}
                          />
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
              <Field
                name="firstName"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames(
                      'form-group',
                      form.errors[field.name] && 'has-error'
                    )}
                  >
                    <label htmlFor={field.name} className="control-label">
                      First Name
                    </label>
                    <div className="error-bar" />
                    <input
                      id={field.name}
                      type="text"
                      {...field}
                      className="form-control"
                    />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="col-sm-6">
              <Field
                name="lastName"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames(
                      'form-group',
                      form.errors[field.name] && 'has-error'
                    )}
                  >
                    <label htmlFor={field.name} className="control-label">
                      Last Name
                    </label>
                    <div className="error-bar" />
                    <input
                      id={field.name}
                      type="text"
                      {...field}
                      className="form-control"
                    />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <Field
                name="country"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames(
                      'form-group',
                      form.errors[field.name] && 'has-error'
                    )}
                  >
                    <label htmlFor={field.name} className="control-label">
                      Country
                    </label>
                    <div className="error-bar" />
                    <FormSelect options={countryOptions} {...field} />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <Field
                name="city"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames(
                      'form-group',
                      form.errors[field.name] && 'has-error'
                    )}
                  >
                    <label htmlFor={field.name} className="control-label">
                      City
                    </label>
                    <div className="error-bar" />
                    <input
                      id={field.name}
                      type="text"
                      {...field}
                      className="form-control"
                    />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="col-sm-6">
              <Field
                name="zip"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames(
                      'form-group',
                      form.errors[field.name] && 'has-error'
                    )}
                  >
                    <label htmlFor={field.name} className="control-label">
                      ZIP
                    </label>
                    <div className="error-bar" />
                    <input
                      id={field.name}
                      type="text"
                      {...field}
                      className="form-control"
                    />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <Field
                name="address"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames(
                      'form-group',
                      form.errors[field.name] && 'has-error'
                    )}
                  >
                    <label htmlFor={field.name} className="control-label">
                      Address
                    </label>
                    <div className="error-bar" />
                    <input
                      id={field.name}
                      type="text"
                      {...field}
                      className="form-control"
                    />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <Field
                name="phone"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames(
                      'form-group',
                      form.errors[field.name] && 'has-error'
                    )}
                  >
                    <label htmlFor={field.name} className="control-label">
                      Phone Number
                    </label>
                    <div className="error-bar" />
                    <input
                      id={field.name}
                      type="tel"
                      {...field}
                      className="form-control"
                      disabled={true}
                    />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="col-sm-6">
              <Field
                name="email"
                render={({field, form}: FieldProps<DepositCreditCardModel>) => (
                  <div
                    className={classNames(
                      'form-group',
                      form.errors[field.name] && 'has-error'
                    )}
                  >
                    <label htmlFor={field.name} className="control-label">
                      E-mail
                    </label>
                    <div className="error-bar" />
                    <input
                      id={field.name}
                      type="email"
                      {...field}
                      className="form-control"
                      disabled={true}
                    />
                    {form.errors[field.name] && (
                      <span className="help-block">
                        {form.errors[field.name]}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="deposit-credit-card-form__links">
            <a href="https://www.lykke.com/terms_of_use" target="_blank">
              Terms of Use
            </a>
          </div>

          <div
            className={classNames(
              'deposit-credit-card-form__actions',
              formikBag.status && 'has-error'
            )}
          >
            <input
              type="submit"
              value="Cash In"
              className="btn btn--primary"
              disabled={formikBag.isSubmitting || !formikBag.isValid}
            />
            {!!formikBag.status && (
              <div className="help-block">{formikBag.status}</div>
            )}
            <Link to={ROUTE_WALLETS} className="btn btn--flat">
              Cancel and go back
            </Link>
          </div>
        </Form>
      )}
    />
  );
};

export default inject(STORE_ROOT)(observer(DepositCreditCardForm));
