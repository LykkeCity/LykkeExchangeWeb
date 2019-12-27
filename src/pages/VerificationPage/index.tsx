import {Dialog} from '@lykkex/react-components';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import Footer from '../../components/Footer';
import Spinner from '../../components/Spinner';
import {VerificationHeader} from '../../components/Verification';
// import {AnalyticsEvent, Place} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';
import AccountInformation from './AccountInformation';
import Address from './Address';
import Completed from './Completed';
import Funds from './Funds';
import Identity from './Identity';
import InReview from './InReview';
import Questionnaire from './Questionnaire';
import Selfie from './Selfie';
import Sidebar from './Sidebar';
import './style.css';
import UpgradeLimit from './UpgradeLimit';

/* tslint:disable:no-empty */
export class VerificationPage extends React.Component<RootStoreProps> {
  readonly kycStore = this.props.rootStore!.kycStore;

  async componentDidMount() {
    await this.kycStore.fetchVerificationData();
  }

  renderServerFileUploadErrorDialog() {
    const showFileUploadServerErrorModal = this.kycStore
      .showFileUploadServerErrorModal;
    return (
      <Dialog
        visible={showFileUploadServerErrorModal}
        onCancel={() => {}}
        onConfirm={() => {
          this.kycStore.setShowFileUploadServerErrorModal(false);
        }}
        confirmButton={{text: 'Try Again'}}
        cancelButton={{text: ''}}
        title="Error"
        description={<span>An error occurred while uploading your file</span>}
      />
    );
  }

  render() {
    const currentFormToRender = this.kycStore.decideCurrentFormToRender;
    if (!currentFormToRender) {
      return null;
    }

    const formMapping = {
      AccountInformation: <AccountInformation />,
      Completed: <Completed />,
      InReview: <InReview />,
      PoA: <Address />,
      PoF: <Funds />,
      PoI: <Identity />,
      Questionnaire: <Questionnaire />,
      Selfie: <Selfie />,
      Spinner: <Spinner />,
      UpgradeLimit: <UpgradeLimit />
    };

    return (
      <div className="verification-page">
        <VerificationHeader />
        {this.renderServerFileUploadErrorDialog()}
        <div className="container-fluid">
          <div className="verification-page__sidebar-container col-sm-5">
            <Sidebar />
          </div>
          <div className="col-sm-7">
            <div className="verification-page__content-inner">
              {formMapping[currentFormToRender]}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(VerificationPage));
