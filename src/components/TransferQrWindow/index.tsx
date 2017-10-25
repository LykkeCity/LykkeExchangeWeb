import Modal, {ModalProps} from 'antd/lib/modal/Modal';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {TransferModel} from '../../models';
import './style.css';

interface TransferQrWindowProps extends RootStoreProps, ModalProps {
  transfer: TransferModel;
}

export class TransferQrWindow extends React.Component<TransferQrWindowProps> {
  render() {
    const {transfer} = this.props;
    return (
      <Modal
        visible={this.props.rootStore!.uiStore.showQrWindow}
        title="Address"
        okText="Cancel transaction"
        cancelText="Close"
        className="transfer-qr"
        {...this.props}
      >
        <p className="transfer-qr__desc">
          Please use your LykkeWallet app to confirm the transfer:
        </p>
        <div className="transfer-qr__img">
          {transfer.asBase64 && (
            <img
              src={`//lykke-qr.azurewebsites.net/QR/${transfer.asBase64}.gif`}
              alt="qr"
              height={160}
              width={160}
            />
          )}
        </div>
      </Modal>
    );
  }
}

export default inject(STORE_ROOT)(observer(TransferQrWindow));
