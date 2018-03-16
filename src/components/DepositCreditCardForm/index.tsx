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
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {AssetModel, DepositCreditCardModel} from '../../models';
import {AmountInput} from '../AmountInput';
import {FormSelect} from '../FormSelect';
import {NumberFormat} from '../NumberFormat';

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
    value: c.id
  }));

  return (
    <Formik
      initialValues={deposit}
      // tslint:disable-next-line:jsx-no-lambda
      validate={() => ({})}
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
            setErrors({[err.field]: err.message});
          }
          setStatus(err.message);
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
                          <NumberFormat
                            value={field.value * bankCardsFeeSizePercentage}
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
                <FormSelect options={countryOptions} {...field} />
                {form.errors[field.name] && (
                  <span className="help-block">{form.errors[field.name]}</span>
                )}
              </div>
            )}
          />

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
                <input
                  id={field.name}
                  type="text"
                  {...field}
                  className="form-control"
                />
                {form.errors[field.name] && (
                  <span className="help-block">{form.errors[field.name]}</span>
                )}
              </div>
            )}
          />

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
              disabled={formikBag.isSubmitting}
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
