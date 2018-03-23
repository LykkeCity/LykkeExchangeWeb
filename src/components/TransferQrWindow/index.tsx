import Modal, {ModalProps} from 'antd/lib/modal/Modal';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {withRouter} from 'react-router';
import {RootStoreProps} from '../../App';
import {ROUTE_TRANSFER_BASE} from '../../constants/routes';
import {TransferModel} from '../../models/index';
import './style.css';

// tslint:disable-next-line:no-var-requires
const QRCode = require('qrcode.react');

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
    <Modal
      visible={showQrWindow}
      title="Confirm the transfer"
      // tslint:disable-next-line:jsx-no-lambda
      onCancel={() => {
        return;
      }}
      className="transfer-qr"
      closable={false}
      maskClosable={false}
      footer={[
        <button
          key="cancelTx"
          className="btn btn--primary"
          onClick={handleCancelTransfer}
        >
          Cancel transaction
        </button>
      ]}
      {...rest}
    >
      <p className="transfer-qr__desc">
        Scan the QR code with your Lykke Wallet
      </p>
      <div className="transfer-qr__img">
        <QRCode size={160} value={transferStore.newTransfer.asBase64} />
      </div>
    </Modal>
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
