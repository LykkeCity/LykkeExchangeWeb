import {Dialog} from '@lykkecity/react-components';
import classNames from 'classnames';
import {Field, FieldProps, Form, Formik, FormikProps} from 'formik';
import {inject, observer} from 'mobx-react';
import React from 'react';
import Yup from 'yup';
import {RootStoreProps} from '../../App';
import {Wrapper} from '../../components/Verification';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';

/* tslint:disable:no-empty */
export class AccountInformation extends React.Component<RootStoreProps> {
  private readonly kycStore = this.props.rootStore!.kycStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  renderForm(formikBag: FormikProps<any>) {
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
        render={({field, form}: FieldProps<any>) => (
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
      <Wrapper loading={formikBag.isSubmitting}>
        <div className="verification-page__big-title">Account Information</div>
        <div className="verification-page__content">
          Please fill out your address so we are enabled to verify your account.
          We ensure the confidentiality of your personal information.
          <div className="account-info-form">
            <div className="verification-page__card">
              <div className="container">
                <div className="row">
                  <Form>
                    <div className="col-sm-12">
                      {renderField('streetAddress', 'Street Address')}
                    </div>
                    <div className="col-sm-6">
                      {renderField('building', 'Building')}
                    </div>
                    <div className="col-sm-6">
                      {renderField('apartment', 'Apartment')}
                    </div>
                    <div className="col-sm-12">{renderField('zip', 'Zip')}</div>
                    <div className="col-sm-12">
                      <input
                        type="submit"
                        className="btn btn--primary"
                        value="Submit"
                        disabled={formikBag.isSubmitting || !formikBag.isValid}
                      />
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  renderUpdateAccountErrorModal() {
    const showUpdateAccountErrorModal = this.kycStore
      .showUpdateAccountErrorModal;
    return (
      <Dialog
        visible={showUpdateAccountErrorModal}
        onCancel={() => {}}
        onConfirm={() => {
          this.kycStore.setShowUpdateAccountErrorModal(false);
        }}
        confirmButton={{text: 'Close'}}
        cancelButton={{text: ''}}
        title="Error"
        description={<span>An error occurred while uploading your file</span>}
      />
    );
  }

  render() {
    const requiredErrorMessage = (fieldName: string) =>
      `Field ${fieldName} should not be empty`;
    const registration = this.kycStore.registration;
    return (
      <div>
        {this.renderUpdateAccountErrorModal()}
        <Formik
          initialValues={{
            apartment: '',
            building: '',
            streetAddress: registration
              ? registration.PersonalData.Address || ''
              : '',
            zip: registration ? registration.PersonalData.Zip || '' : ''
          }}
          enableReinitialize
          validationSchema={Yup.object().shape({
            building: Yup.string().trim(),
            streetAddress: Yup.string()
              .trim()
              .required(requiredErrorMessage('street address')),
            zip: Yup.string().required(requiredErrorMessage('zip'))
          })}
          // tslint:disable-next-line:jsx-no-lambda
          onSubmit={async (values: any, {setSubmitting}) => {
            this.analyticsService.track(
              AnalyticsEvent.Kyc.SubmitAccountInformation
            );
            setSubmitting(true);
            let address = '';
            if (values.apartment) {
              address = `${values.streetAddress} ${values.building}, Apt ${values.apartment}`;
            } else {
              address = `${values.streetAddress} ${values.building}`;
            }
            try {
              await this.kycStore.updateAccountInformation(address, values.zip);
              setSubmitting(false);
            } catch (e) {
              setSubmitting(false);
            }
          }}
          render={this.renderForm}
        />
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(AccountInformation));
