import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import AffiliateTabs from '../../components/AffiliateTabs/index';
// import {ROUTE_AFFILIATE} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

export class AffiliatePage extends React.Component<RootStoreProps> {
  constructor(props: any) {
    super(props);
  }

  async componentDidMount() {
    await this.props.rootStore!.featureStore.getFeatures();
  }

  render() {
    return (
      <div className="container">
        <AffiliateTabs />
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(AffiliatePage));
