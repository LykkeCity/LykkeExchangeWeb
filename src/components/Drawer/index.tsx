import * as classNames from 'classnames';
import {observer} from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './style.css';

interface DrawerProps {
  show: boolean;
  title: string;
}

export class Drawer extends React.Component<DrawerProps> {
  render() {
    return ReactDOM.createPortal(
      <div className={classNames('drawer', {'drawer--open': this.props.show})}>
        <div
          className={classNames('drawer__body', {
            'drawer__body--open': this.props.show
          })}
        >
          <div className="drawer__breadcrumb">
            <strong>Summary</strong>
            <span>&nbsp;>&nbsp;{this.props.title}</span>
          </div>
          <div className="drawer__content">{this.props.children}</div>
        </div>
        <div className="drawer__overlay">&nbsp;</div>
      </div>,
      document.body
    );
  }
}

export default observer(Drawer);
