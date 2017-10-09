import {Icon} from 'antd';
import Button from 'antd/lib/button/button';
import Form from 'antd/lib/form/Form';
import Input from 'antd/lib/input/Input';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect} from 'react-router';
import {ROUTE_WALLET} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {RootStore} from '../../stores';
import './style.css';

interface LoginFormProps {
  form: any;
  rootStore?: RootStore;
}

const FormItem = Form.Item;

export class LoginForm extends React.Component<LoginFormProps> {
  readonly authStore = this.props.rootStore!.authStore;

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        const {email, password} = values;
        this.authStore.signIn({email, password});
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return this.authStore.isAuthenticated ? (
      <Redirect to={ROUTE_WALLET} />
    ) : (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{required: true, message: 'Please input your email!'}]
          })(
            <Input prefix={<Icon type="mail" />} placeholder="Email address" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{required: true, message: 'Please input your password!'}]
          })(
            <Input
              prefix={<Icon type="lock" />}
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Sign in
          </Button>
          <Button className="login-form-button">Sign up</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(
  inject(STORE_ROOT)(observer(LoginForm))
);
export default WrappedNormalLoginForm;
