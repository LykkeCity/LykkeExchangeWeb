import {Dialog} from '@lykkecity/react-components';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import Footer from '../../components/Footer';
import Spinner from '../../components/Spinner';
import {VerificationHeader, Wrapper} from '../../components/Verification';
// import {AnalyticsEvent, Place} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';
import AccountInformation from './AccountInformation';
import Address from './Address';
import Completed from './Completed';
import Funds from './Funds';
import Identity from './Identity';
import InReview from './InReview';
import NeedToFillData from './NeedToFillData';
import Questionnaire from './Questionnaire';
import Rejected from './Rejected';
import Selfie from './Selfie';
import Sidebar from './Sidebar';
import './style.css';
import UpgradeLimit from './UpgradeLimit';

/* tslint:disable:no-empty */
export class VerificationPage extends React.Component<
  RootStoreProps & RouteComponentProps<any>
> {
  readonly kycStore = this.props.rootStore!.kycStore;

  async componentDidMount() {
    await this.kycStore.fetchVerificationData();
    await this.kycStore.fetchQuestionnaire();
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
      Completed: <Completed {...this.props} />,
      InReview: <InReview {...this.props} />,
      NeedToFillData: <NeedToFillData />,
      PoA: <Address />,
      PoF: <Funds />,
      PoI: <Identity />,
      Questionnaire: <Questionnaire />,
      Rejected: <Rejected />,
      Selfie: <Selfie />,
      Spinner: (
        <Wrapper>
          <Spinner />
        </Wrapper>
      ),
      UpgradeLimit: <UpgradeLimit />
    };

    return (
      <div className="verification-page">
        <VerificationHeader />
        {this.renderServerFileUploadErrorDialog()}
        <div className="container-fluid">
          <div className="col-sm-5 verification-page__sidebar-container">
            <Sidebar />
          </div>
          <div className="col-sm-7">{formMapping[currentFormToRender]}</div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(VerificationPage));
