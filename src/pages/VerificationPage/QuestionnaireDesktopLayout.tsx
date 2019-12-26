import {Form, Formik} from 'formik';
import {inject, observer} from 'mobx-react';
import React from 'react';
import Yup from 'yup';
import {RootStoreProps} from '../../App';
import Spinner from '../../components/Spinner';
import {Question} from '../../components/Verification';
import {STORE_ROOT} from '../../constants/stores';
import {Questionnaire} from '../../models';

export class QuestionnaireDesktopLayout extends React.Component<
  RootStoreProps
> {
  private readonly kycStore = this.props.rootStore!.kycStore;
  createValidationSchema() {
    const questionnaire = this.kycStore.questionnaire;
    const shape = {};
    questionnaire.map((question: Questionnaire) => {
      let yup = Yup.string().trim();
      if (question.Required) {
        yup = yup.required();
      }
      shape[question.Id] = yup;
    });
    return Yup.object().shape(shape);
  }

  getInitialValues() {
    const questionnaire = this.kycStore.questionnaire;
    const values = {};

    questionnaire.map(question => {
      values[question.Id] = '';
    });

    return values;
  }

  render() {
    const questionnaire = this.kycStore.questionnaire;
    return (
      <Formik
        initialValues={this.getInitialValues()}
        enableReinitialize
        validationSchema={this.createValidationSchema()}
        render={formikBag => (
          <Form>
            {questionnaire.map((question: Questionnaire) => (
              <Question key={question.Id} question={question} />
            ))}
            <input
              type="submit"
              value="Submit"
              className="btn btn--primary"
              disabled={formikBag.isSubmitting || !formikBag.isValid}
            />
            {formikBag.isSubmitting && <Spinner />}
          </Form>
        )}
        onSubmit={async (values: any, {setSubmitting}) => {
          setSubmitting(true);
          await this.kycStore.updateQuestionnaire(values);
          setSubmitting(false);
        }}
      />
    );
  }
}

export default inject(STORE_ROOT)(observer(QuestionnaireDesktopLayout));
