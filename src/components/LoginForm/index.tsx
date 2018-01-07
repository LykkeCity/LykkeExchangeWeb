import {Field, Form, Formik, FormikProps} from 'formik';
import {runInAction} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect} from 'react-router';
import {RootStoreProps} from '../../App';
import {ROUTE_ROOT} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import Button from '../Button';
import FormItem from '../FormItem';
import {Icon} from '../Icon';
import './style.css';

interface LoginFormProps extends RootStoreProps {
  form?: any;
}

interface LoginFormState extends RootStoreProps {
  errors: any;
  loading: boolean;
}

interface LoginFormValues {
  email: string;
  password: string;
}

export class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
  readonly authStore = this.props.rootStore!.authStore;
  state: LoginFormState = {
    errors: '',
    loading: false
  };

  handleSubmit = (values: LoginFormValues, actions: any) => {
    actions.setSubmitting(true);
    this.authStore
      .login(values.email, values.password)
      .then(resp => {
        actions.setSubmitting(false);
        const {authStore} = this.props.rootStore!;
        runInAction(() => {
          authStore.token = resp.AccessToken;
        });
      })
      .catch(error => {
        actions.setSubmitting(false);
        actions.setErrors(JSON.parse(error.message));
        setTimeout(() => {
          actions.setErrors(null);
        }, 3000);
      });
  };

  handleSignup = (e: any, values: LoginFormValues) => {
    e.preventDefault();
    this.authStore
      .signup(values.email, values.password)
      .then(resp => {
        const {profileStore, authStore} = this.props.rootStore!;
        runInAction(() => {
          profileStore.firstName = resp.PersonalData.FirstName;
          profileStore.lastName = resp.PersonalData.LastName;
          authStore.token = resp.Token;
        });
      })
      .catch(error => {
        this.setState({errors: JSON.parse(error.message)});
        setTimeout(() => {
          this.setState({errors: undefined});
        }, 3000);
      });
  };

  handleValidate = (values: LoginFormValues) => {
    const errors: any = {};
    if (!values.email) {
      errors.email = 'Please input your email!';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = 'Please input valid email!';
    }
    if (!values.password) {
      errors.password = 'Please input your password!';
    }
    return errors;
  };

  render() {
    return !!this.authStore.token ? (
      <Redirect to={ROUTE_ROOT} />
    ) : (
      <Formik
        initialValues={{email: '', password: ''}}
        validate={this.handleValidate}
        onSubmit={this.handleSubmit}
        // tslint:disable-next-line:jsx-no-lambda
        render={({
          values,
          errors,
          touched,
          isSubmitting
        }: FormikProps<LoginFormValues>) => (
          <Form className="login-form">
            <FormItem>
              <span className="input-group-addon">
                <Icon name="email" />
              </span>
              <Field
                name="email"
                type="text"
                placeholder="Email address"
                className="form-control"
              />
              {errors &&
                errors.email &&
                touched.email && (
                  <div className="form-explain">{errors.email}</div>
                )}
            </FormItem>
            <FormItem>
              <span className="input-group-addon">
                <Icon name="lock" />
              </span>
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="form-control"
              />
              {errors &&
                errors.password &&
                touched.password && (
                  <div className="form-explain">{errors.password}</div>
                )}
              {!!errors &&
                !errors.email &&
                !errors.password &&
                Object.keys(errors).map(x => (
                  <div key={x} className="form-explain">
                    {errors[x]}
                  </div>
                ))}
            </FormItem>
            <FormItem>
              <Button type="submit" width={370} disabled={isSubmitting}>
                Sign in
              </Button>
            </FormItem>
            <FormItem>
              <Button
                shape="flat"
                width={370}
                onClick={event => this.handleSignup(event, values)}
              >
                Sign up
              </Button>
            </FormItem>
          </Form>
        )}
      />
    );
  }
}

const WrappedNormalLoginForm = inject(STORE_ROOT)(observer(LoginForm));
export default WrappedNormalLoginForm;
