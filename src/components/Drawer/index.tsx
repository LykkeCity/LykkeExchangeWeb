import {observer} from 'mobx-react';
import * as React from 'react';
import './style.css';

interface DrawerProps {
  show: boolean;
  title: string;
}

export class Drawer extends React.Component<DrawerProps> {
  render() {
    return this.props.show ? (
      <div>
        <div className="drawer">
          <div className="drawer__breadcrumb">
            <strong>Summary</strong> > {this.props.title}
          </div>
          <div className="drawer__content">{this.props.children}</div>
        </div>
        <div className="drawer__overlay">&nbsp;</div>
      </div>
    ) : null;
  }
}

export default observer(Drawer);
