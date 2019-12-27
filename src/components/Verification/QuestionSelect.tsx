import classNames from 'classnames';
import {Field, FieldConfig} from 'formik';
import React from 'react';
import {Answer, Questionnaire} from '../../models';

interface QuestionSelectProps {
  question: Questionnaire;
}

interface QuestionSelectState {
  open: boolean;
  showOtherInput: boolean;
}

export class QuestionSelect extends React.Component<
  QuestionSelectProps,
  QuestionSelectState
> {
  selectRef: any;
  state = {
    open: false,
    showOtherInput: false
  } as QuestionSelectState;

  constructor(props: QuestionSelectProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('mousedown', this.handleClick, false);
    document.addEventListener('touchstart', this.handleClick, false);
  }

  componentWilUnmount(): void {
    document.removeEventListener('mousedown', this.handleClick, false);
    document.removeEventListener('touchend', this.handleClick, false);
  }

  handleClick(e: Event) {
    if (this.selectRef && this.selectRef.contains(e.target)) {
      return;
    }

    this.hideDropdown();
  }

  showDropdown() {
    this.setState({open: true});
  }

  hideDropdown() {
    this.setState({open: false});
  }

  showOrHide(field: FieldConfig, form: any) {
    if (this.state.open) {
      this.hideDropdown();
    } else {
      this.showDropdown();
    }
    form.setFieldTouched(field.name);
  }

  renderOption(answer: Answer, field: FieldConfig, form: any) {
    const {question} = this.props;
    const value = field.value || {};
    value.answerIds = value.answerIds || [];
    const answerId = answer.Id;
    const answerSelected = value.answerIds.indexOf(answerId) > -1;
    return (
      <div
        key={answerId}
        className={classNames('question-dropdown__option', {
          selected: answerSelected
        })}
        onClick={() => {
          if (question.Type === 'Multiple') {
            if (answerId === 'OTHER') {
              this.setState({showOtherInput: true});
              this.hideDropdown();
            } else {
              if (answerSelected) {
                value.answerIds = value.answerIds.filter(
                  (v: string) => v !== answerId
                );
              } else {
                value.answerIds.push(answerId);
                this.hideDropdown();
              }
            }
            if (value.answerIds.length > 0) {
              form.setFieldValue(field.name, value);
            } else {
              form.setFieldValue(field.name, null);
            }
          } else if (question.Type === 'Single') {
            if (answerId === 'OTHER') {
              this.setState({showOtherInput: true});
            } else {
              value.answerIds = [answerId];
              form.setFieldValue(field.name, value);
              this.setState({showOtherInput: false});
            }
            this.hideDropdown();
          }
        }}
      >
        <div className="question-dropdown__option-text">{answer.Text}</div>
        {answerSelected && (
          <div className="question-dropdown__option-check">✓</div>
        )}
      </div>
    );
  }

  getSelectedItemTag(answer: Answer, field: FieldConfig, form: any) {
    const value = field.value || {};
    value.answerIds = value.answerIds || [];
    value.other = value.other || '';
    return (
      <span className="question-placeholder-tag" key={answer.Id}>
        <span className="question-placeholder-tag__text">{answer.Text}</span>
        <span
          className="question-placeholder-tag__remove"
          onClick={() => {
            value.answerIds = value.answerIds.filter(
              (v: string) => v !== answer.Id
            );
            form.setFieldValue(field.name, value);
          }}
        >
          x
        </span>
      </span>
    );
  }

  getPlaceholder(field: FieldConfig, form: any) {
    const {question} = this.props;
    let placeholder;
    const value = field.value || {};
    value.answerIds = value.answerIds || [];

    if (value.answerIds.length > 0) {
      if (question.Type === 'Single') {
        const selectedAnswer = question.Answers.filter(
          a => a.Id === value.answerIds[0]
        )[0];
        placeholder = (
          <div className="question-placeholder__text selected">
            {selectedAnswer ? selectedAnswer.Text : ''}
          </div>
        );
      } else if (question.Type === 'Multiple') {
        const selectedAnswers = question.Answers.filter(
          a => value.answerIds.indexOf(a.Id) > -1
        );
        placeholder = (
          <div className="question-placeholder-tags">
            {selectedAnswers.map((answer: Answer) =>
              this.getSelectedItemTag(answer, field, form)
            )}
          </div>
        );
      }
    } else {
      placeholder = (
        <div className="question-placeholder__text">{question.Text}</div>
      );
    }

    return placeholder;
  }

  renderOtherInput(field: FieldConfig, form: any) {
    const value = field.value || {};
    value.other = value.other || '';
    return (
      <div className="question__other">
        <input
          type="text"
          value={value.other}
          className="form-control"
          placeholder="Please specify"
          onChange={(e: any) => {
            if (e.target.value) {
              value.other = e.target.value;
              form.setFieldValue(field.name, value);
            } else {
              form.setFieldValue(field.name, null);
            }
          }}
        />
      </div>
    );
  }

  render() {
    const {question} = this.props;
    const {open, showOtherInput} = this.state;
    const answers = question.Answers;
    const renderError = (field: FieldConfig, form: any) =>
      form.errors[field.name] &&
      form.touched[field.name] && <span className="question__error">*</span>;

    return (
      <Field name={question.Id}>
        {({field, form}: any) => (
          <div
            className="question"
            ref={(ref: any) => {
              this.selectRef = ref;
            }}
          >
            <div className="question__text">
              {question.Index}. {question.Text}
              {renderError(field, form)}
            </div>
            <div
              className={classNames('question-placeholder', {
                'has-error': form.errors[field.name] && form.touched[field.name]
              })}
              onClick={() => this.showOrHide(field, form)}
            >
              {this.getPlaceholder(field, form)}
              <span className="question-placeholder__arrow">
                {open ? '△' : '▽'}
              </span>
            </div>
            <div>
              <div
                className={classNames(
                  'question-dropdown',
                  open ? 'open' : 'hide'
                )}
              >
                {answers.map(answer => this.renderOption(answer, field, form))}
                {question.HasOther &&
                  this.renderOption(
                    {
                      Id: 'OTHER',
                      Text: 'Other, please specify'
                    },
                    field,
                    form
                  )}
              </div>
            </div>
            {showOtherInput && this.renderOtherInput(field, form)}
          </div>
        )}
      </Field>
    );
  }
}
