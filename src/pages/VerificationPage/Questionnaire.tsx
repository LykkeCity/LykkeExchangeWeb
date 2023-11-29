import {Dialog} from '@lykkecity/react-components';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import Spinner from '../../components/Spinner';
import {Wrapper} from '../../components/Verification';
import {STORE_ROOT} from '../../constants/stores';
import QuestionnaireDesktopLayout from './QuestionnaireDesktopLayout';
import QuestionnaireMobileLayout from './QuestionnaireMobileLayout';

interface VerifyQuestionnaireState {
  layout: 'MOBILE' | 'DESKTOP';
}

/* tslint:disable:no-empty */
export class Questionnaire extends React.Component<
  RootStoreProps,
  VerifyQuestionnaireState
> {
  state = {
    layout: 'DESKTOP'
  } as VerifyQuestionnaireState;
  private readonly kycStore = this.props.rootStore!.kycStore;

  componentWillMount() {
    if (window.innerWidth <= 768) {
      this.setState({layout: 'MOBILE'});
    } else {
      this.setState({layout: 'DESKTOP'});
    }
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
    const questionnaireSubmitting = this.kycStore.questionnaireSubmitting;
    let layoutToRender;

    if (layout === 'MOBILE') {
      layoutToRender = <QuestionnaireMobileLayout />;
    } else if (layout === 'DESKTOP') {
      layoutToRender = <QuestionnaireDesktopLayout />;
    }
    return (
      <Wrapper loading={questionnaireSubmitting}>
        {this.renderUpdateErrorDialog()}
        <div className="verification-page__big-title">Questionnaire</div>
        <div className="verification-page__content">
          <div className="verification-page__card">
            {questionnaire.length === 0 && <Spinner />}
            <div className="questionnaire">{layoutToRender}</div>
          </div>
        </div>
      </Wrapper>
    );
  }
}

export default inject(STORE_ROOT)(observer(Questionnaire));
