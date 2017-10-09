import * as React from 'react';
import LoginForm from '../../components/LoginForm';
import Logo from '../../components/Logo';

export class LoginPage extends React.Component {
  render() {
    return (
      <div>
        <Logo />
        <LoginForm />
      </div>
    );
  }
}

export default LoginPage;
