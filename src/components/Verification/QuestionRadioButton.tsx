import classnames from 'classnames';
import {Field, FieldConfig, FieldProps} from 'formik';
import React from 'react';
import {Answer, Questionnaire} from '../../models';

interface QuestionProps {
  question: Questionnaire;
}

export const QuestionRadioButton: React.SFC<QuestionProps> = ({question}) => {
  const renderError = (field: FieldConfig, form: any) =>
    form.errors[field.name] &&
    form.touched[field.name] && <span className="question__error">*</span>;

  return (
    <Field
      name={question.Id}
      render={({field, form}: FieldProps<any>) => (
        <div className="question">
          <div className="question__text">
            {question.Index}. {question.Text}
            {renderError(field, form)}
          </div>
          <div className="question-radio">
            {question.Answers.map((answer: Answer) => {
              const answerId = answer.Id;
              const value = field.value || {};
              value.answerIds = value.answerIds || [];
              return (
                <span
                  key={answerId}
                  className={classnames('question-radio__button', {
                    active: value.answerIds[0]
                      ? value.answerIds[0] === answerId
                      : false
                  })}
                  onClick={() => {
                    value.answerIds = [answerId];
                    form.setFieldValue(field.name, value);
                  }}
                >
                  {answer.Text}
                </span>
              );
            })}
          </div>
        </div>
      )}
    />
  );
};
