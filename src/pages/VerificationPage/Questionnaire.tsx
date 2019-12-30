import {Dialog} from '@lykkex/react-components';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import Spinner from '../../components/Spinner';
import {STORE_ROOT} from '../../constants/stores';
import QuestionnaireDesktopLayout from './QuestionnaireDesktopLayout';
import QuestionnaireMobileLayout from './QuestionnaireMobileLayout';

interface VerifyQuestionnaireProps {
  layout: 'MOBILE' | 'DESKTOP';
}

/* tslint:disable:no-empty */
export class Questionnaire extends React.Component<
  RootStoreProps,
  VerifyQuestionnaireProps
> {
  state = {
    layout: 'DESKTOP'
  } as VerifyQuestionnaireProps;
  private readonly kycStore = this.props.rootStore!.kycStore;

  componentWillMount() {
    if (window.innerWidth <= 768) {
      this.setState({layout: 'MOBILE'});
    } else {
      this.setState({layout: 'DESKTOP'});
    }
  }

  componentDidMount() {
    this.kycStore.fetchQuestionnaire();
  }

  renderUpdateErrorDialog() {
    const showUpdateQuestionnaireErrorModal = this.kycStore
      .showUpdateQuestionnaireErrorModal;
    return (
      <Dialog
        visible={showUpdateQuestionnaireErrorModal}
        onCancel={() => {}}
        onConfirm={() => {
          this.kycStore.setShowUpdateQuestionnaireErrorModal(false);
        }}
        confirmButton={{text: 'Try Again'}}
        cancelButton={{text: ''}}
        title="Error"
        description={
          <span>An error occurred while uploading your answers</span>
        }
      />
    );
  }

  render() {
    const {layout} = this.state;
    const questionnaire = this.kycStore.questionnaire;
    let layoutToRender;

    if (layout === 'MOBILE') {
      layoutToRender = <QuestionnaireMobileLayout />;
    } else if (layout === 'DESKTOP') {
      layoutToRender = <QuestionnaireDesktopLayout />;
    }
    return (
      <div>
        {this.renderUpdateErrorDialog()}
        <div className="verification-page__big-title">Questionnaire</div>
        <div className="verification-page__content">
          <div className="verification-page__card">
            {questionnaire.length === 0 && <Spinner />}
            <div className="questionnaire">{layoutToRender}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(Questionnaire));
