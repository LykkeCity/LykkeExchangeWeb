import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {InjectedRootStoreProps} from '../../App';
import {ROUTE_WALLET} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';
import './style.css';

enum Dir {
  From = 'from',
  To = 'to'
}

export class TransferPage extends React.Component<InjectedRootStoreProps> {
  @observable amount: number = 0;
  @observable
  fromWallet: WalletModel = this.props.rootStore!.uiStore.currentWallet ||
    new WalletModel();
  @observable toWallet: WalletModel = new WalletModel();

  render() {
    return (
      <div className="transfer">
        <h1>Transfer</h1>
        <h2>{this.amount} BTC</h2>
        <p className="transfer__desc">
          To transfer any asset to other wallet please fill in the form.
        </p>
        <div className="transfer__bar">
          <span>Templates</span>
          <span>Recent transfers</span>
          <span>Add to favorites</span>
        </div>
        <form className="transfer__form">
          <div>
            <label>Asset</label>
            <select>
              <option value="BTC">BTC</option>
            </select>
          </div>
          <div>
            <label>From</label>
            <select
              onChange={this.handleChangeWallet(Dir.From)}
              value={this.fromWallet.id}
            >
              {this.props.rootStore!.walletStore.wallets.map(w => (
                <option key={w.id} value={w.id}>
                  {w.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>To</label>
            <select onChange={this.handleChangeWallet(Dir.To)}>
              {this.props.rootStore!.walletStore.wallets.map(w => (
                <option key={w.id} value={w.id}>
                  {w.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Amount</label>
            <input type="text" onChange={this.handleChangeAmount} />
          </div>
        </form>
        <div className="transfer__actions">
          <div>
            <input type="submit" value="Submit" onClick={this.handleSubmit} />
          </div>
          <div>
            <Link to={ROUTE_WALLET}>Cancel and go back</Link>
          </div>
        </div>
      </div>
    );
  }

  private readonly handleChangeAmount = (e: React.ChangeEvent<any>) => {
    this.amount = e.currentTarget.value;
  };

  private readonly handleChangeWallet = (dir: Dir) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const {walletStore} = this.props.rootStore!;
    this.fromWallet =
      (dir === Dir.From &&
        walletStore.wallets.find(x => x.id === e.currentTarget.value)) ||
      this.fromWallet;
    this.toWallet =
      (dir === Dir.To &&
        walletStore.wallets.find(x => x.id === e.currentTarget.value)) ||
      this.toWallet;
  };

  private readonly handleSubmit = () => {
    this.fromWallet.transfer(this.toWallet, this.amount);
  };
}

export default inject(STORE_ROOT)(observer(TransferPage));
