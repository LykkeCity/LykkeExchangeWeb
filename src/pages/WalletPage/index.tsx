import Button from 'antd/lib/button/button';
import Form, {FormComponentProps} from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Input from 'antd/lib/input/Input';
import 'antd/lib/modal/style/css';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect} from 'react-router';
import {InjectedRootStoreProps} from '../../App';
import Drawer from '../../components/Drawer/index';
import WalletList from '../../components/WalletList';
import {ROUTE_LOGIN} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

export class WalletPage extends React.Component<InjectedRootStoreProps> {
  private readonly authStore = this.props.rootStore!.authStore;
  private readonly walletStore = this.props.rootStore!.walletStore;

  @observable private showCreateWalletWindow: boolean = false;
  @observable private walletName: string;
  @observable private walletApiKey: string;

  componentDidMount() {
    this.walletStore.fetchAll();
  }

  render() {
    return !this.authStore.token ? ( // FIXME: refactor to ProtectedRoute HOC
      <Redirect to={ROUTE_LOGIN} />
    ) : (
      <div>
        <Button
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => {
            this.showCreateWalletWindow = true;
          }}
        >
          Create new wallet
        </Button>
        <WalletList loading={this.walletStore.loading} />
        <Drawer
          title="New API Wallet"
          visible={this.showCreateWalletWindow}
          onOk={this.handleCreateWallet(this.walletName)}
          // tslint:disable-next-line:jsx-no-lambda
          onClose={() => (this.showCreateWalletWindow = false)}
          cancelText="Cancel and close"
          okText="Generate API Key"
        >
          <h2>New Wallet</h2>
          <h3>API Wallet</h3>
          <h4>Name of wallet</h4>
          <WalletFormWrapper />
        </Drawer>
      </div>
    );
  }

  private readonly handleCreateWallet = (name: string) => async () => {
    const wallet = await this.walletStore.createApiWallet(this.walletName);
    this.walletApiKey = wallet.apiKey;
  };
}

const WalletForm = (props: FormComponentProps) => {
  const {getFieldDecorator} = props.form;
  return (
    <Form layout="vertical">
      <FormItem label="Name of wallet">
        {getFieldDecorator('name', {
          rules: [
            {
              message: 'Please input the title of collection!',
              required: true
            }
          ]
        })(<Input />)}
      </FormItem>
    </Form>
  );
};

const WalletFormWrapper = Form.create()(WalletForm as any);

export default inject(STORE_ROOT)(observer(WalletPage));
