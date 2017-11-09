import Modal, {ModalProps} from 'antd/lib/modal/Modal';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLET} from '../../constants/routes';
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
    transferStore: {newTransfer: transfer},
    uiStore: {showQrWindow, toggleQrWindow}
  } = rootStore!;

  const handleCancel = async () => {
    await transfer.cancel();
    toggleQrWindow();
    history.replace(ROUTE_WALLET);
  };

  return (
    <Modal
      visible={showQrWindow}
      title="Address"
      onCancel={toggleQrWindow}
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
          src={`//lykke-qr.azurewebsites.net/QR/${transfer.asBase64}.gif`}
          alt="qr"
          height={160}
          width={160}
        />
      </div>
    </Modal>
  );
};

export default withRouter(inject(STORE_ROOT)(observer(TransferQrWindow)));
