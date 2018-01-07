import * as React from 'react';
import {IconButton} from '../Icon';
import {ModalProps} from '../ModalDialog';

interface DialogProps extends ModalProps {
  footer?: React.ReactNode;
  title?: React.ReactNode | string;
  content?: React.ReactNode;
  visible?: boolean;
  onClose?: (e: React.MouseEvent<any>) => void;
}

class Dialog extends React.Component<DialogProps> {
  render() {
    const {
      footer,
      title,
      content,
      visible,
      onClose,
      closable = true
    } = this.props;
    return visible ? (
      <div className={'modal-dialog-content'}>
        {closable ? (
          <IconButton
            className="modal-dialog-close"
            name={'close'}
            onClick={onClose}
          />
        ) : null}
        {title ? (
          <div className="modal-dialog-header">
            <div className="modal-dialog-title">{title}</div>
          </div>
        ) : null}
        {content ? (
          <div className="modal-dialog-body">
            <div className="modal__text">{content}</div>
          </div>
        ) : null}
        {footer}
      </div>
    ) : null;
  }
}

export default Dialog;
