import * as classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {WalletModel} from '../../models';
import {RootStore} from '../../stores';
import {Icon, IconButton} from '../Icon';
import styled from '../styled';
import {Theme} from '../theme';
import WalletTotalBalance from '../WalletTotalBalance';

const StyledEditIconButton = styled(IconButton)`
  position: absolute;
  left: -35px;

  @media all and (max-width: ${({theme}: Theme) => theme!.screenTablet}) {
    left: -30px;
  }

  @media all and (max-width: ${({theme}: Theme) => theme!.screenMobile}) {
    left: -20px;
  }
`;

export interface WalletActions {
  onEditWallet?: (w: WalletModel) => void;
}

interface WalletSummaryProps extends WalletActions {
  wallet: WalletModel;
}

export const WalletSummary: React.SFC<WalletSummaryProps> = ({
  wallet,
  onEditWallet
}) => (
  <div>
    <div className="row">
      <div className="col-sm-7">
        <div className="wallet__info">
          <h2
            onClick={wallet.toggleCollapse}
            className={classNames('wallet__title', 'text--truncate')}
          >
            {wallet.isTrading ? null : (
              <StyledEditIconButton
                name="edit_alt"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={e => {
                  e.stopPropagation();
                  onEditWallet!(wallet);
                }}
              />
            )}
            {wallet.title}
            <Icon
              name={wallet.expanded ? 'chevron-thin-up' : 'chevron-thin-down'}
            />
          </h2>
          <div className="wallet__desc">{wallet.desc || 'No description'}</div>
        </div>
      </div>
      <div className="col-sm-5">
        <WalletTotalBalance wallet={wallet} />
      </div>
    </div>
  </div>
);

export default inject(({rootStore}: {rootStore: RootStore}) => ({
  onEditWallet: (wallet: WalletModel) => {
    rootStore.walletStore.selectWallet(wallet);
    rootStore.uiStore.toggleWalletDrawer();
  }
}))(observer(WalletSummary));
