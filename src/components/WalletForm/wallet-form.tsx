import * as classNames from 'classnames';
import {Field, Form, Formik, FormikProps} from 'formik';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {WalletModel} from '../../models/index';
import {Button} from '../Button/index';
import GenerateWalletKeyForm from '../GenerateWalletKeyForm';

interface WalletFormProps extends RootStoreProps {
  wallet: WalletModel;
  submitLabel: string;
  onSubmit: (w: WalletFormValues) => void;
  onCancel: React.MouseEventHandler<any>;
}

export interface WalletFormValues {
  title: string;
  desc: string;
  apiKey: string;
}

export class WalletForm extends React.Component<WalletFormProps> {
  state = {isSubmitting: false, isApiKeyUpdated: false};
  @observable hasErrors = false;

  render() {
    const {wallet, onCancel, submitLabel} = this.props;

    return (
      <Formik
        initialValues={{
          desc: wallet.desc,
          title: wallet.title
        }}
        validate={this.validateForm}
        onSubmit={this.handleSubmit}
        // tslint:disable-next-line:jsx-no-lambda
        render={({
          values,
          errors,
          touched,
          handleChange
        }: FormikProps<WalletFormValues>) => (
          <Form>
            <div className="form-group">
              <label htmlFor="name" className="control-label">
                Name of wallet
              </label>
              <Field
                type="text"
                name="title"
                onChange={handleChange}
                className={classNames('form-control', {
                  'form-control--error': errors && errors.title && touched.title
                })}
                required={true}
                autoFocus={true}
              />
              {errors &&
                errors.title &&
                touched.title && (
                  <div className="label_error">{errors.title}</div>
                )}
            </div>
            <div className="form-group">
              <label htmlFor="desc" className="control-label">
                Description
              </label>
              <textarea
                name="desc"
                placeholder="Put your description, like My API Wallet"
                className="form-control"
                onChange={handleChange}
                value={values.desc}
              />
            </div>
            <Field type="hidden" name="apiKey" />
            {!!wallet.apiKey && <GenerateWalletKeyForm wallet={wallet} />}
            <div className="drawer__footer">
              <Button
                type="button"
                onClick={() => this.handleSave(values)}
                className="pull-right"
                disabled={
                  (errors && errors.title && touched.title) ||
                  this.state.isSubmitting
                }
              >
                {submitLabel}
              </Button>
              <Button
                shape="flat"
                onClick={onCancel}
                disabled={this.state.isApiKeyUpdated}
              >
                Cancel and close
              </Button>
            </div>
          </Form>
        )}
      />
    );
  }

  private handleSubmit = async (values: WalletFormValues) => {
    this.setState({
      isApiKeyUpdated: values.apiKey !== this.props.wallet.apiKey
    });
  };

  private handleSave = async (values: WalletFormValues) => {
    this.setState({isSubmitting: true});
    try {
      await this.props.onSubmit(values);
    } finally {
      this.setState({isSubmitting: false});
    }
  };

  private validateForm = (values: WalletFormValues) => {
    const errors: any = {};
    if (!values.title || values.title.length === 0) {
      errors.title = 'Please input the name of the wallet';
    }
    return errors;
  };
}

export default observer(WalletForm);
