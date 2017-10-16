import Button from 'antd/lib/button/button';
import {observer} from 'mobx-react';
import * as React from 'react';
import './style.css';

interface DrawerProps {
  visible: boolean;
  title: string;
  cancelText?: string;
  okText?: string;
  onOk?: () => any;
  onClose?: () => any;
}

export class Drawer extends React.Component<DrawerProps> {
  render() {
    return this.props.visible ? (
      <div>
        <div className="drawer">
          <div className="drawer__breadcrumb">
            <strong>Summary</strong> > {this.props.title}
          </div>
          <div className="drawer__content">
            {this.props.children}
            <div className="drawer__footer">
              <Button onClick={this.props.onClose} type="ghost">
                {this.props.cancelText || 'Cancel'}
              </Button>
              <Button onClick={this.props.onOk} type="primary">
                {this.props.okText || 'Ok'}
              </Button>
            </div>
          </div>
        </div>
        <div className="drawer__overlay">&nbsp;</div>
      </div>
    ) : null;
  }
}

export default observer(Drawer);
