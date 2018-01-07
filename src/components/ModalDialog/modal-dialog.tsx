import './style.css';

import * as React from 'react';
import Modal from 'react-modal';
import {Dialog} from './';

export interface ModalProps {
  title?: React.ReactNode | string;
  style?: React.CSSProperties;
  className?: string;
  closable?: boolean;
  maskClosable?: boolean;
  visible?: boolean;
  onOk?: (e: React.MouseEvent<any>) => void;
  onCancel?: (e: React.MouseEvent<any>) => void;
  footer?: React.ReactNode;
}

class ModalDialog extends React.Component<ModalProps, {}> {
  handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    const onCancel = this.props.onCancel;
    if (onCancel) {
      onCancel(e);
    }
  };

  handleClose = (e: any) => {
    const onCancel = this.props.onCancel;
    if (onCancel) {
      onCancel(e);
    }
  };

  componentDidMount() {
    Modal.setAppElement(document.body);
  }

  render() {
    const {footer, visible, children, maskClosable} = this.props;

    return visible ? (
      <Modal
        className={'modal-dialog-wrap'}
        overlayClassName={'modal-dialog-mask'}
        onRequestClose={this.handleClose}
        shouldCloseOnOverlayClick={maskClosable}
        isOpen={visible}
      >
        <div className={'modal-dialog'}>
          <Dialog
            {...this.props}
            content={children}
            footer={footer}
            visible={visible}
            onClose={this.handleCancel}
          />
        </div>
      </Modal>
    ) : null;
  }
}

export default ModalDialog;
