import * as classNames from 'classnames';
import {Field, Form, Formik, FormikProps} from 'formik';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {WalletModel} from '../../models/index';
import {Button} from '../Button/index';

interface WalletFormProps extends RootStoreProps {
  wallet: WalletModel;
  submitLabel: string;
  onSubmit: (w: WalletFormValues) => void;
  onCancel: React.MouseEventHandler<any>;
}

export interface WalletFormValues {
  title: string;
  desc: string;
}

export class WalletForm extends React.Component<WalletFormProps> {
  @observable hasErrors = false;

  render() {
    const {wallet, onCancel, onSubmit, submitLabel} = this.props;

    return (
      <Formik
        initialValues={{
          desc: wallet.desc,
          title: wallet.title
        }}
        validate={this.validateForm}
        validateOnBlur={false}
        onSubmit={onSubmit}
        // tslint:disable-next-line:jsx-no-lambda
        render={({
          values,
          errors,
          touched,
          handleChange,
          isSubmitting
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
            <div className="drawer__footer">
              <Button
                type="submit"
                className="pull-right"
                disabled={
                  (errors && errors.title && touched.title) || isSubmitting
                }
              >
                {submitLabel}
              </Button>
              <Button shape="flat" onClick={onCancel}>
                Cancel and close
              </Button>
            </div>
          </Form>
        )}
      />
    );
  }

  private validateForm = (values: WalletFormValues) => {
    const errors: any = {};
    if (!values.title || values.title.length === 0) {
      errors.title = 'Please input the name of the wallet';
    }
    return errors;
  };
}

export default observer(WalletForm);
