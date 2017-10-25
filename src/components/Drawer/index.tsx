import {observer} from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './style.css';

interface DrawerProps {
  show: boolean;
  title: string;
}

export class Drawer extends React.Component<DrawerProps> {
  componentWillReceiveProps(props: DrawerProps) {
    document.body.style.overflow = props.show ? 'hidden' : 'auto';
  }

  render() {
    return this.props.show
      ? (ReactDOM as any).createPortal(
          <div className="drawer">
            <div className="drawer__body">
              <div className="drawer__breadcrumb">
                <strong>Summary</strong>
                <span>&nbsp;>&nbsp;{this.props.title}</span>
              </div>
              <div className="drawer__content">{this.props.children}</div>
            </div>
            <div className="drawer__overlay">&nbsp;</div>
          </div>,
          document.getElementById('drawer-portal')
        )
      : null;
  }
}

export default observer(Drawer);
