import Modal, {ModalProps} from 'antd/lib/modal/Modal';
import * as React from 'react';
import {TransferModel} from '../../models';
import './style.css';

interface TransferQrWindowProps extends ModalProps {
  transfer: TransferModel;
}

export class TransferQrWindow extends React.Component<TransferQrWindowProps> {
  render() {
    const {transfer} = this.props;
    return (
      <Modal
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
          <img
            src={`//lykke-qr.azurewebsites.net/QR/${transfer.asQr}.gif`}
            alt="qr"
            height={160}
            width={160}
          />
        </div>
        <div />
      </Modal>
    );
  }
}

export default TransferQrWindow;
