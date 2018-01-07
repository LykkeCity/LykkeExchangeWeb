import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {withRouter} from 'react-router';
import {RootStoreProps} from '../../App';
import {ROUTE_TRANSFER_BASE} from '../../constants/routes';
import {TransferModel} from '../../models/index';
import {Button} from '../Button';
import ModalDialog, {ModalProps} from '../ModalDialog';

interface TransferQrWindowProps extends ModalProps {
  resetCurrentTransfer?: any;
  transfer?: TransferModel;
  showQrWindow?: boolean;
  closeQrWindow?: any;
  history?: any;
  transferStore?: any;
}

export const TransferQrWindow: React.SFC<TransferQrWindowProps> = ({
  history,
  resetCurrentTransfer,
  showQrWindow,
  closeQrWindow,
  transfer,
  transferStore,
  ...rest
}) => {
  const handleCancelTransfer = async () => {
    try {
      await transferStore.newTransfer.cancel();
    } finally {
      resetCurrentTransfer();
      closeQrWindow();
      history.replace(ROUTE_TRANSFER_BASE);
    }
  };

  return (
    <ModalDialog
      visible={showQrWindow}
      title="Confirm the transfer"
      // tslint:disable-next-line:jsx-no-lambda
      onCancel={() => {
        return;
      }}
      closable={false}
      maskClosable={false}
      footer={[
        <Button key="cancelTx" width={290} onClick={handleCancelTransfer}>
          Cancel Transaction
        </Button>
      ]}
      {...rest}
    >
      <p>Scan the QR code with your Lykke Wallet</p>
      <div>
        <img
          src={`//lykke-qr.azurewebsites.net/QR/${transferStore.newTransfer
            .asBase64}.gif`}
          alt="qr"
          height={160}
          width={160}
        />
      </div>
    </ModalDialog>
  );
};

export default withRouter(
  inject((stores: RootStoreProps) => ({
    closeQrWindow: stores.rootStore!.uiStore.closeQrWindow,
    resetCurrentTransfer: stores.rootStore!.transferStore.resetCurrentTransfer,
    showQrWindow: stores.rootStore!.uiStore.showQrWindow,
    transfer: stores.rootStore!.transferStore.newTransfer,
    transferStore: stores.rootStore!.transferStore
  }))(observer(TransferQrWindow))
);
