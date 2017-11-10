import Modal, {ModalProps} from 'antd/lib/modal/Modal';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {withRouter} from 'react-router';
import {RootStoreProps} from '../../App';
import {ROUTE_TRANSFER_BASE} from '../../constants/routes';
import {TransferModel} from '../../models/index';
// import {STORE_ROOT} from '../../constants/stores';
import './style.css';

interface TransferQrWindowProps extends ModalProps {
  resetCurrentTransfer?: any;
  transfer?: TransferModel;
  showQrWindow?: boolean;
  toggleQrWindow?: any;
  history?: any;
}

export const TransferQrWindow: React.SFC<TransferQrWindowProps> = ({
  history,
  resetCurrentTransfer,
  showQrWindow,
  toggleQrWindow,
  transfer,
  ...rest
}) => {
  const handleCancelTransfer = async () => {
    await transfer!.cancel();
    resetCurrentTransfer();
    toggleQrWindow();
    history.replace(ROUTE_TRANSFER_BASE);
  };

  return (
    <Modal
      visible={showQrWindow}
      title="Address"
      // tslint:disable-next-line:jsx-no-lambda
      onCancel={() => {
        return;
      }}
      className="transfer-qr"
      closable={false}
      maskClosable={false}
      footer={[
        <button
          key="cancel"
          className="btn btn--primary"
          onClick={handleCancelTransfer}
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
          src={`//lykke-qr.azurewebsites.net/QR/${transfer!.asBase64}.gif`}
          alt="qr"
          height={160}
          width={160}
        />
      </div>
    </Modal>
  );
};

export default withRouter(
  inject((stores: RootStoreProps) => ({
    resetCurrentTransfer: stores.rootStore!.transferStore.resetCurrentTransfer,
    showQrWindow: stores.rootStore!.uiStore.showQrWindow,
    toggleQrWindow: stores.rootStore!.uiStore.toggleQrWindow,
    transfer: stores.rootStore!.transferStore.newTransfer
  }))(observer(TransferQrWindow))
);
