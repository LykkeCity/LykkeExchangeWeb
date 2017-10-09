import * as React from 'react';
import WalletList from '../../components/WalletList';
import {RootStore} from '../../stores';

export class WalletPage extends React.Component<{rootStore: RootStore}> {
  render() {
    return <WalletList />;
  }
}

export default WalletPage;
