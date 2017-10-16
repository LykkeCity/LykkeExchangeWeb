import Button from 'antd/lib/button/button';
import Modal from 'antd/lib/modal/Modal';
import 'antd/lib/modal/style/css';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect} from 'react-router';
import {InjectedRootStoreProps} from '../../App';
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
        <Modal
          title="Create new wallet"
          visible={this.showCreateWalletWindow}
          okText="Ok"
          cancelText="Cancel"
          // tslint:disable-next-line:jsx-no-lambda
          onOk={async () => {
            const wallet = await this.walletStore.createApiWallet(
              this.walletName
            );
            this.walletApiKey = wallet.apiKey;
          }}
          // tslint:disable-next-line:jsx-no-lambda
          onCancel={() => (this.showCreateWalletWindow = false)}
        >
          <div>
            <input
              type="text"
              placeholder="Place a name for your wallet"
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                this.walletName = e.currentTarget.value;
              }}
            />
          </div>
          <div>
            <input
              type="text"
              name="apikey"
              id="apikey"
              value={this.walletApiKey}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(WalletPage));
