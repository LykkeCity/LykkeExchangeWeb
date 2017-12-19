import {History} from 'history';
import {inject, observer} from 'mobx-react';
import QRCode from 'qrcode.react';
import * as React from 'react';
import {withRouter} from 'react-router';
import {RootStoreProps} from '../../App';
import {ROUTE_TRANSFER_BASE} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {Button} from '../Button';
import ModalDialog from '../ModalDialog';

interface TransferQrWindowProps extends RootStoreProps {
  history?: History;
}

export const TransferQrWindow: React.SFC<TransferQrWindowProps> = ({
  rootStore,
  history
}) => {
  const {uiStore, transferStore} = rootStore!;
  const {closeQrWindow, showQrWindow} = uiStore;
  const {resetCurrentTransfer} = transferStore;

  const handleCancelTransfer = async () => {
    try {
      await transferStore!.newTransfer.cancel();
    } finally {
      resetCurrentTransfer();
      closeQrWindow();
      history!.replace(ROUTE_TRANSFER_BASE);
    }
  };

  return (
    <ModalDialog
      visible={showQrWindow}
      title="Confirm the transfer"
      closable={false}
      maskClosable={false}
      footer={[
        <Button key="cancelTx" width={290} onClick={handleCancelTransfer}>
          Cancel Transaction
        </Button>
      ]}
    >
      <p>Scan the QR code with your Lykke Wallet</p>
      {transferStore && (
        <div style={{textAlign: 'center'}}>
          <QRCode
            value={transferStore.newTransfer.asBase64}
            size={160}
            level="M"
          />
        </div>
      )}
    </ModalDialog>
  );
};

export default withRouter(inject(STORE_ROOT)(observer(TransferQrWindow)));
