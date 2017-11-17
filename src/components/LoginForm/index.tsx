import Button from 'antd/lib/button/button';
import Form from 'antd/lib/form/Form';
import Input from 'antd/lib/input/Input';
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

const FormItem = Form.Item;

export class LoginForm extends React.Component<LoginFormProps> {
  readonly authStore = this.props.rootStore!.authStore;

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        this.authStore.login(values.email, values.password);
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
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="btn btn--primary btn-sm"
          >
            Sign in
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(
  inject(STORE_ROOT)(observer(LoginForm))
);
export default WrappedNormalLoginForm;
