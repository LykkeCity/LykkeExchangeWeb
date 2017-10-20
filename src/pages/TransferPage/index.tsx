import 'antd/lib/modal/style';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {InjectedRootStoreProps} from '../../App';
import TransferBar from '../../components/TransferBar';
import TransferForm from '../../components/TransferForm/index';
import TransferQrWindow from '../../components/TransferQrWindow';
import {STORE_ROOT} from '../../constants/stores';
import {TransferModel} from '../../models';
import './style.css';

export class TransferPage extends React.Component<
  InjectedRootStoreProps & RouteComponentProps<any>
> {
  @observable transfer: TransferModel = TransferModel.blank();
  @observable showQrWindow: boolean;

  componentDidMount() {
    this.props.rootStore!.walletStore
      .fetchById(this.props.match.params.walletId)
      .then(w => (this.transfer.from = w));
  }

  render() {
    return (
      <div className="transfer">
        <h1>Transfer</h1>
        <h2>{this.transfer.amount} BTC</h2>
        <p className="transfer__desc">
          To transfer any asset to other wallet please fill in the form.
        </p>
        <TransferBar />
        <TransferForm
          transfer={this.transfer}
          walletStore={this.props.rootStore!.walletStore}
          onTransfer={this.handleTransfer}
        />
        <TransferQrWindow
          visible={this.showQrWindow}
          transfer={this.transfer}
          onCancel={this.toggleQrWindow}
        />
      </div>
    );
  }

  private readonly handleTransfer = async (transfer: TransferModel) => {
    this.toggleQrWindow();
  };

  // private readonly handleOkTransfer = (transfer: TransferModel) => {
  //   this.props.history.replace(`${ROUTE_TRANSFER}/success`, {
  //     amount: transfer.amount // TODO: replace with transferStore
  //   });
  // };

  private readonly toggleQrWindow = () =>
    (this.showQrWindow = !this.showQrWindow);
}

export default inject(STORE_ROOT)(observer(TransferPage));
