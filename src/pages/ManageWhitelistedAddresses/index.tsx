import {computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {Drawer} from '../../components/Drawer';
import Spinner from '../../components/Spinner';
import {ROUTE_WALLETS_HFT} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import WhitelistingModel from '../../models/whitelistingModel';
import {WhitelistingActions} from './elements/whitelisting-actions';
import {WhitelistingFilters} from './elements/whitelisting-filters';
import {WhitelistingForm} from './elements/whitelisting-form';
import {WhitelistingList} from './elements/whitelisting-list';
import './style.css';

const PAGE_SIZE: number = 3;

// TODO: move a common place
export type WhitelistingErrorCodes =
  | 'None'
  | 'Unknown'
  | 'TwoFactorRequired'
  | 'SecondFactorCheckForbiden'
  | 'SecondFactorCodeIncorrect'
  | 'AssetUnavailable'
  | 'BlockchainWalletDepositAddressNotGenerated'
  | 'AddressAlreadyWhitelisted';

export class ManageWhitelistedAddressesPage extends React.Component<
  RootStoreProps
> {
  private readonly whitelistingStore = this.props.rootStore!.whitelistingStore;
  private readonly uiStore = this.props.rootStore!.uiStore;

  @observable private filter: string = '';
  @observable private selectedWhitelisting?: WhitelistingModel = undefined;

  @observable private page: number = 1;
  @observable private pageSize: number = PAGE_SIZE;
  @computed
  private get lastPage() {
    return this.filteredWhitelistings && this.filteredWhitelistings.length
      ? Math.ceil(this.filteredWhitelistings.length / this.pageSize)
      : 1;
  }

  @computed
  private get filteredWhitelistings() {
    const {whitelistings} = this.whitelistingStore;
    const filter = this.filter.toLowerCase();
    return filter.length && whitelistings && whitelistings.length
      ? whitelistings.filter(
          x =>
            x.name.toLowerCase().includes(filter) ||
            x.walletName.toLowerCase().includes(filter) ||
            x.addressBase.toLowerCase().includes(filter) ||
            (x.addressExtension || '--').toLowerCase().includes(filter) ||
            x.status.toLowerCase().includes(filter)
        )
      : whitelistings;
  }

  @computed
  private get allWhitelistingsCount() {
    const {whitelistings} = this.whitelistingStore;
    return whitelistings ? whitelistings.length : 0;
  }

  @computed
  private get filteredWhitelistingsCount() {
    return this.filteredWhitelistings ? this.filteredWhitelistings.length : 0;
  }

  @computed
  private get pagedWhitelistings() {
    return this.filteredWhitelistings && this.filteredWhitelistings.length
      ? this.filteredWhitelistings.slice(
          (this.page - 1) * this.pageSize,
          this.page * this.pageSize
        )
      : this.filteredWhitelistings;
  }

  componentDidMount() {
    this.fetchAll();
    this.fetchCryptoOperations();
    this.fetchWallets();

    window.addEventListener('click', this.handleGlobalClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleGlobalClick);
  }

  render() {
    if (
      (this.whitelistingStore.isLoading && !this.whitelistingStore.isLoaded) ||
      this.whitelistingStore.isLoadingCryptoOperations
    ) {
      return <Spinner />;
    }

    return (
      <div className="manage-whitelisted-addresses-page-wrapper">
        <div className="container">
          {this.uiStore.showWhitelistingDrawer && (
            <Drawer title="" show={this.uiStore.showWhitelistingDrawer}>
              <div className="drawer__title">
                {this.selectedWhitelisting ? (
                  <div>
                    <h2>Remove Address</h2>
                    <h3>
                      Please confirm if you are sure to remove the following
                      address permanently
                    </h3>
                  </div>
                ) : (
                  <h2>New Address</h2>
                )}
              </div>
              <WhitelistingForm
                isSubmitting={
                  this.whitelistingStore.isLoadingDelete ||
                  this.whitelistingStore.isLoadingCreate
                }
                selectedItem={this.selectedWhitelisting}
                cryptoOperations={this.whitelistingStore.cryptoOperations}
                wallets={this.whitelistingStore.wallets}
                addSubmit={this.handleAddSubmit}
                deleteSubmit={this.handleDeleteSubmit}
                cancelClick={this.handleCancelSubmit}
              />
            </Drawer>
          )}
          <Link to={ROUTE_WALLETS_HFT} className="arrow-back">
            <img
              src={`${process.env.PUBLIC_URL}/images/back-icn.svg`}
              alt="Back"
            />
          </Link>
          <div className="manage-whitelisted-addresses-page">
            <div className="content">
              <WhitelistingFilters
                filter={this.filter}
                filteredCount={this.filteredWhitelistingsCount}
                allCount={this.allWhitelistingsCount}
                filterChange={this.handleFilterChange}
              />
              {this.whitelistingStore.isLoading ? (
                <Spinner />
              ) : (
                <WhitelistingList
                  items={this.pagedWhitelistings}
                  selectedItem={this.selectedWhitelisting}
                  page={this.page}
                  pageSize={this.pageSize}
                  lastPage={this.lastPage}
                  filteredCount={this.filteredWhitelistingsCount}
                  itemClick={this.handleItemClick}
                  prevPageClick={this.handlePrevClick}
                  nextPageClick={this.handleNextClick}
                />
              )}
            </div>
            <WhitelistingActions
              deleteEnabled={!!this.selectedWhitelisting}
              addClick={this.handleAddClick}
              deleteClick={this.handleDeleteClick}
            />
          </div>
        </div>
      </div>
    );
  }

  private fetchAll = async () => {
    try {
      await this.whitelistingStore.fetchAll();
      if (this.page > this.lastPage) {
        this.page = 1;
      }
    } catch (error) {
      // TODO
    }
  };

  private fetchCryptoOperations = async () => {
    try {
      await this.whitelistingStore.fetchCryptoOperations();
    } catch (error) {
      // TODO
    }
  };

  private fetchWallets = async () => {
    try {
      await this.whitelistingStore.fetchWallets();
    } catch (error) {
      // TODO
    }
  };

  private handlePrevClick = () => this.page--;

  private handleNextClick = () => this.page++;

  private getSubmitErrorCode(response: any): WhitelistingErrorCodes {
    if (response.IsCodeValid === true) {
      return 'None';
    } else if (response.Error) {
      if (
        response.Error.Code === 'TwoFactorRequired' ||
        response.Error.Code === 'SecondFactorCheckForbiden' ||
        response.Error.Code === 'SecondFactorCodeIncorrect'
      ) {
        return response.Error.Code as WhitelistingErrorCodes;
      } else {
        return 'Unknown';
      }
    } else {
      return 'Unknown';
    }
  }

  private handleAddSubmit = async (
    name: string,
    assetId: string,
    walletId: string,
    addressBase: string,
    addressExtension: string,
    code2fa: string
  ): Promise<WhitelistingErrorCodes> => {
    try {
      const response = await this.whitelistingStore.createWhitelisting(
        name,
        assetId,
        walletId,
        addressBase,
        addressExtension,
        code2fa
      );
      const errorCode = this.getSubmitErrorCode(response);
      if (errorCode === 'None') {
        this.uiStore.toggleWhitelistingDrawer();
        this.fetchAll();
      }
      return errorCode;
    } catch (error) {
      // TODO: error.code
      const err = error.toString();
      if (err.includes('AssetUnavailable')) {
        return 'AssetUnavailable';
      } else if (err.includes('BlockchainWalletDepositAddressNotGenerated')) {
        return 'BlockchainWalletDepositAddressNotGenerated';
      } else if (err.includes('AddressAlreadyWhitelisted')) {
        return 'AddressAlreadyWhitelisted';
      } else {
        return 'Unknown';
      }
    }
  };

  private handleDeleteSubmit = async (code2fa: string) => {
    try {
      const response = await this.whitelistingStore.deleteWhitelisting(
        this.selectedWhitelisting!.id,
        code2fa
      );
      const errorCode = this.getSubmitErrorCode(response);
      if (errorCode === 'None') {
        this.uiStore.toggleWhitelistingDrawer();
        this.fetchAll();
      }
      return errorCode;
    } catch (error) {
      return 'Unknown';
    }
  };

  private handleCancelSubmit = () => this.uiStore.toggleWhitelistingDrawer();

  private handleItemClick = (item: WhitelistingModel) =>
    setTimeout(() => (this.selectedWhitelisting = item), 0);

  private handleGlobalClick = () => this.resetSelectedWhitelisting();

  private resetSelectedWhitelisting = () => {
    if (!this.uiStore.showWhitelistingDrawer) {
      this.selectedWhitelisting = undefined;
    }
  };

  private handleFilterChange = (value: string) => {
    this.filter = value;
    this.resetSelectedWhitelisting();
    this.resetPage();
  };

  private resetPage = () => (this.page = 1);

  private handleAddClick = () => {
    this.resetSelectedWhitelisting();
    this.uiStore.toggleWhitelistingDrawer();
  };

  private handleDeleteClick = () => this.uiStore.toggleWhitelistingDrawer();
}

export default inject(STORE_ROOT)(observer(ManageWhitelistedAddressesPage));
