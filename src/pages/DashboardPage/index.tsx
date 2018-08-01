import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import BalanceSection from '../../components/BalanceSection';
import ProfileSection from '../../components/ProfileSection';
import {STORE_ROOT} from '../../constants/stores';

interface DashboardPageProps extends RootStoreProps, RouteComponentProps<any> {}

export class DashboardPage extends React.Component<DashboardPageProps> {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="dashboard-page-wrapper">
        <div className="container">
          <ProfileSection />
          <BalanceSection />
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(DashboardPage));
