import * as classNames from 'classnames';
import {observer} from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Icon} from '../Icon';
import './style.css';

interface DrawerProps {
  show: boolean;
  title: string;
}

const DRAWER_CLASS_NAME = 'drawer';

export class Drawer extends React.Component<DrawerProps> {
  render() {
    return ReactDOM.createPortal(
      <div
        className={classNames(DRAWER_CLASS_NAME, {
          [DRAWER_CLASS_NAME + '--show']: this.props.show
        })}
      >
        <div className="drawer__body">
          <div className="drawer__breadcrumbs breadcrumbs">
            <strong className="breadcrumbs_item">Summary</strong>
            <Icon name="chevron-thin-right" size="10px" />
            <span className="breadcrumbs_item breadcrumbs_item--current">
              {this.props.title}
            </span>
          </div>
          <div className="drawer__content">{this.props.children}</div>
        </div>
      </div>,
      document.body
    );
  }
}

export default observer(Drawer);
