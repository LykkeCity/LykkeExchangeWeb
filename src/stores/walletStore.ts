import {observable} from 'mobx';
import {RootStore} from '.';
import {WalletModel} from '../models';

export class WalletStore {
  readonly rootStore: RootStore;

  @observable wallets: WalletModel[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    this.wallets.push(
      new WalletModel({
        title: `Mobile Wallet`,
        // tslint:disable-next-line:object-literal-sort-keys
        desc:
          'Lorem ipsum dolor sit amet, mel id dicant ceteros neglegentur. Duisefficiantur mea ne. Accusam oporteat constituam vis ad, mea ne mazimdicit. His paulo detracto ad, eum brute tempor ad. Cu eum requevoluptua lucilius, agam atqui essent his cu. An eum affertconsetetur neglegentur, iriure prompta periculis sit ex.',
        figures: {
          total: 36897.32,
          // tslint:disable-next-line:object-literal-sort-keys
          received: 45280.46,
          sent: 2340.56,
          pnl: 53
        }
      })
    );
    this.wallets.push(
      new WalletModel({
        title: `API Wallet`,
        // tslint:disable-next-line:object-literal-sort-keys
        desc:
          'Lorem ipsum dolor sit amet, mel id dicant ceteros neglegentur. Duisefficiantur mea ne. Accusam oporteat constituam vis ad, mea ne mazimdicit. His paulo detracto ad, eum brute tempor ad. Cu eum requevoluptua lucilius, agam atqui essent his cu. An eum affertconsetetur neglegentur, iriure prompta periculis sit ex.',
        figures: {
          total: 0,
          // tslint:disable-next-line:object-literal-sort-keys
          received: 0,
          sent: 0,
          pnl: 0
        }
      })
    );
    this.wallets.push(
      new WalletModel({
        title: `Web Wallet`,
        // tslint:disable-next-line:object-literal-sort-keys
        desc:
          'Lorem ipsum dolor sit amet, mel id dicant ceteros neglegentur. Duisefficiantur mea ne. Accusam oporteat constituam vis ad, mea ne mazimdicit. His paulo detracto ad, eum brute tempor ad. Cu eum requevoluptua lucilius, agam atqui essent his cu. An eum affertconsetetur neglegentur, iriure prompta periculis sit ex.',
        figures: {
          total: 3897.32,
          // tslint:disable-next-line:object-literal-sort-keys
          received: 45280.46,
          sent: 2340.56,
          pnl: 53
        }
      })
    );
  }
}

export default WalletStore;
