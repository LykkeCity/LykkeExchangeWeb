import Button from 'antd/lib/button/button';
import Form from 'antd/lib/form/Form';
import Input from 'antd/lib/input/Input';
import {runInAction} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect} from 'react-router';
import {RootStoreProps} from '../../App';
import {ROUTE_ROOT} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import './style.css';

interface LoginFormProps extends RootStoreProps {
  form: any;
}

interface LoginFormState extends RootStoreProps {
  errors: any;
  loading: boolean;
}

const FormItem = Form.Item;

export class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
  readonly authStore = this.props.rootStore!.authStore;
  state: LoginFormState = {
    errors: '',
    loading: false
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        this.setState({loading: true});
        this.authStore
          .login(values.email, values.password)
          .then(resp => {
            const {authStore} = this.props.rootStore!;
            runInAction(() => {
              authStore.token = resp.AccessToken;
            });
          })
          .catch(error => {
            this.setState({
              errors: JSON.parse(error.message),
              loading: false
            });
            setTimeout(() => {
              this.setState({errors: undefined});
            }, 3000);
          });
      }
    });
  };

  handleSignup = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
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
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return !!this.authStore.token ? (
      <Redirect to={ROUTE_ROOT} />
    ) : (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          <span className="input-group-addon">
            <i className="icon icon--email" />
          </span>
          {getFieldDecorator('email', {
            rules: [{required: true, message: 'Please input your email!'}]
          })(<Input placeholder="Email address" className="form-control" />)}
        </FormItem>
        <FormItem>
          <span className="input-group-addon">
            <i className="icon icon--lock" />
          </span>
          {getFieldDecorator('password', {
            rules: [{required: true, message: 'Please input your password!'}]
          })(
            <Input
              type="password"
              placeholder="Password"
              className="form-control"
            />
          )}
          {!!this.state.errors &&
            Object.keys(this.state.errors).map(x => (
              <div key={x} className="ant-form-explain">
                {this.state.errors[x]}
              </div>
            ))}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            loading={this.state.loading}
            className="btn btn--primary btn-sm"
          >
            Sign in
          </Button>
        </FormItem>
        <FormItem>
          <a onClick={this.handleSignup}>Sign up</a>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(
  inject(STORE_ROOT)(observer(LoginForm))
);
export default WrappedNormalLoginForm;
