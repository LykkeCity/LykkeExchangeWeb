import {Form, Formik} from 'formik';
import {inject, observer} from 'mobx-react';
import React from 'react';
import Yup from 'yup';
import {RootStoreProps} from '../../App';
import {Question} from '../../components/Verification';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';
import {Questionnaire} from '../../models';

const TOTAL_STEPS = 3;

interface QuestionnaireMobileLayoutProps {
  currentStep: number;
}

export class QuestionnaireMobileLayout extends React.Component<
  RootStoreProps,
  QuestionnaireMobileLayoutProps
> {
  state = {
    currentStep: 1
  } as QuestionnaireMobileLayoutProps;
  private readonly kycStore = this.props.rootStore!.kycStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  questionsPerStep() {
    const questionnaire = this.kycStore.questionnaire;
    return {
      1: questionnaire.slice(0, 4),
      2: questionnaire.slice(4, 9),
      3: questionnaire.slice(9, 99)
    };
  }

  getCurrentQuestions() {
    const {currentStep} = this.state;
    const questionsPerStep = this.questionsPerStep();
    return questionsPerStep[currentStep];
  }

  getCurrentValidationSchema() {
    const {currentStep} = this.state;
    const questionsPerStep = this.questionsPerStep();
    const shape = {};
    questionsPerStep[currentStep].map((question: Questionnaire) => {
      let yup = Yup.string().trim();
      if (question.Required) {
        yup = yup.required();
      }
      shape[question.Id] = yup;
    });
    return Yup.object().shape(shape);
  }

  getInitialValues() {
    const values = {};
    this.getCurrentQuestions().map((question: Questionnaire) => {
      values[question.Id] = '';
    });
    return values;
  }

  renderButton(formikBag: any) {
    const {currentStep} = this.state;
    const questionnaireSubmitting = this.kycStore.questionnaireSubmitting;
    const isLastStep = TOTAL_STEPS === currentStep;
    if (isLastStep) {
      return (
        <div>
          <input
            type="submit"
            value="Submit"
            className="btn btn--primary"
            disabled={questionnaireSubmitting || !formikBag.isValid}
          />
        </div>
      );
    } else {
      return (
        <input
          type="submit"
          value="Continue"
          className="btn btn--primary"
          disabled={!formikBag.isValid}
        />
      );
    }
  }

  render() {
    const {currentStep} = this.state;
    const questionnaire = this.getCurrentQuestions();
    const isLastStep = TOTAL_STEPS === currentStep;
    return (
      <Formik
        initialValues={this.getInitialValues()}
        enableReinitialize={false}
        validationSchema={this.getCurrentValidationSchema()}
        render={formikBag => (
          <Form>
            {questionnaire.map((question: Questionnaire) => (
              <Question key={question.Id} question={question} />
            ))}
            {this.renderButton(formikBag)}
          </Form>
        )}
        onSubmit={async (values: any, formikActions: any) => {
          if (isLastStep) {
            this.analyticsService.track(AnalyticsEvent.Kyc.SubmitQuestionnaire);
            await this.kycStore.updateQuestionnaire(values);
          } else {
            this.setState({currentStep: currentStep + 1});
            formikActions.setTouched({}); // call setTouched() because form stays valid somehow
          }
        }}
      />
    );
  }
}

export default inject(STORE_ROOT)(observer(QuestionnaireMobileLayout));
