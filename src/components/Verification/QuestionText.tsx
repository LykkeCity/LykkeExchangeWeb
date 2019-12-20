import classNames from 'classnames';
import {Field, FieldConfig, FieldProps} from 'formik';
import React from 'react';
import {Questionnaire} from '../../models';

interface QuestionProps {
  question: Questionnaire;
}

// tslint:disable-next-line:jsx-no-lambda
export const QuestionText: React.SFC<QuestionProps> = ({question}) => {
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
          <div
            className={classNames('form-group', {
              'has-error': form.errors[field.name] && form.touched[field.name]
            })}
          >
            <input
              id={question.Id}
              name={question.Id}
              type="text"
              className="form-control"
              placeholder="Please answer this question"
              value={field.value && field.value.other ? field.value.other : ''}
              onBlur={field.onBlur}
              onChange={(e: any) => {
                if (e.target.value) {
                  const value = field.value || {};
                  value.answerIds = value.answerIds || [];
                  value.other = e.target.value;
                  form.setFieldValue(field.name, value);
                } else {
                  form.setFieldValue(field.name, null);
                }
              }}
            />
          </div>
        </div>
      )}
    />
  );
};
