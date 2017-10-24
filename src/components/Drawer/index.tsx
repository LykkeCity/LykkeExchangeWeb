import {observer} from 'mobx-react';
import * as React from 'react';
import './style.css';

interface DrawerProps {
  show: boolean;
  title: string;
  style?: any;
}

export class Drawer extends React.Component<DrawerProps> {
  componentWillReceiveProps(props: DrawerProps) {
    document.body.style.overflow = props.show ? 'hidden' : 'auto';
  }

  render() {
    return this.props.show ? (
      <div className="drawer" style={this.props.style}>
        <div className="drawer__body">
          <div className="drawer__breadcrumb">
            <strong>Summary</strong>
            <span>&nbsp;>&nbsp;{this.props.title}</span>
          </div>
          <div className="drawer__content">{this.props.children}</div>
        </div>
        <div className="drawer__overlay">&nbsp;</div>
      </div>
    ) : null;
  }
}

export default observer(Drawer);
