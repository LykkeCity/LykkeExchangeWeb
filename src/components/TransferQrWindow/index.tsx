import Modal, {ModalProps} from 'antd/lib/modal/Modal';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import './style.css';

type TransferQrWindowProps = RootStoreProps & ModalProps;

export const TransferQrWindow: React.SFC<TransferQrWindowProps> = ({
  rootStore,
  ...rest
}) => {
  const {
    transferStore: {newTransfer: transfer},
    uiStore: {showQrWindow, toggleQrWindow}
  } = rootStore!;
  return (
    <Modal
      visible={showQrWindow}
      title="Address"
      okText="Cancel transaction"
      cancelText="Close"
      onCancel={toggleQrWindow}
      className="transfer-qr"
      {...rest}
    >
      <p className="transfer-qr__desc">
        Please use your LykkeWallet app to confirm the transfer:
      </p>
      <div className="transfer-qr__img">
        <img
          src={`//lykke-qr.azurewebsites.net/QR/${transfer.asBase64}.gif`}
          alt="qr"
          height={160}
          width={160}
        />
      </div>
    </Modal>
  );
};

export default inject(STORE_ROOT)(observer(TransferQrWindow));
