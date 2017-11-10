import Modal, {ModalProps} from 'antd/lib/modal/Modal';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {RootStoreProps} from '../../App';
import {ROUTE_TRANSFER_BASE} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import './style.css';

type TransferQrWindowProps = RootStoreProps &
  ModalProps &
  RouteComponentProps<any>;

export const TransferQrWindow: React.SFC<TransferQrWindowProps> = ({
  rootStore,
  history,
  ...rest
}) => {
  const {
    transferStore,
    transferStore: {newTransfer},
    uiStore: {showQrWindow, toggleQrWindow}
  } = rootStore!;

  const handleCancel = async () => {
    await newTransfer.cancel();
    transferStore.resetCurrentTransfer();
    toggleQrWindow();
    history.replace(ROUTE_TRANSFER_BASE);
  };

  const handleClose = (e: any) => {
    if (e.key !== 'Escape') {
      toggleQrWindow();
    }
  };

  return (
    <Modal
      visible={showQrWindow}
      title="Address"
      onCancel={handleClose}
      className="transfer-qr"
      closable={false}
      footer={[
        <button
          key="cancel"
          className="btn btn--primary"
          onClick={handleCancel}
        >
          Cancel transaction
        </button>
      ]}
      {...rest}
    >
      <p className="transfer-qr__desc">
        Please use your LykkeWallet app to confirm the transfer:
      </p>
      <div className="transfer-qr__img">
        <img
          src={`//lykke-qr.azurewebsites.net/QR/${newTransfer.asBase64}.gif`}
          alt="qr"
          height={160}
          width={160}
        />
      </div>
    </Modal>
  );
};

export default withRouter(inject(STORE_ROOT)(observer(TransferQrWindow)));
