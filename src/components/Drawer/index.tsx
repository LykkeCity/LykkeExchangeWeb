import * as classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import './style.css';

interface DrawerProps extends RootStoreProps {
  show: boolean;
  overlayed?: boolean;
  title: string;
}

const DRAWER_CLASS_NAME = 'drawer';

export class Drawer extends React.Component<DrawerProps> {
  readonly localizationStore = this.props.rootStore!.localizationStore;

  render() {
    const labels = this.localizationStore.i18nDrawer;

    return ReactDOM.createPortal(
      <div
        className={classNames(DRAWER_CLASS_NAME, {
          [DRAWER_CLASS_NAME + '--show']: this.props.show,
          [DRAWER_CLASS_NAME + '--overlayed']: this.props.overlayed
        })}
      >
        <div className="drawer__body">
          <div className="drawer__breadcrumbs breadcrumbs">
            <strong className="breadcrumbs_item">{labels.Summary}</strong>
            <i className="icon icon--chevron-thin-right" />
            <span className="breadcrumbs_item breadcrumbs_item--current">
              {this.props.title}
            </span>
          </div>
          <div className="drawer__content">{this.props.children}</div>
        </div>
        <div className="drawer__overlay">&nbsp;</div>
      </div>,
      document.body
    );
  }
}

export default inject(STORE_ROOT)(observer(Drawer));
