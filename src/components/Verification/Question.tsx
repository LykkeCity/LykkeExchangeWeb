import React from 'react';
import {Questionnaire} from '../../models';
import {QuestionRadioButton} from './QuestionRadioButton';
import {QuestionSelect} from './QuestionSelect';
import {QuestionText} from './QuestionText';

interface QuestionProps {
  question: Questionnaire;
}

export const Question: React.SFC<QuestionProps> = ({question}) => {
  let toRender = null;
  switch (question.Type) {
    case 'Text':
      toRender = <QuestionText question={question} />;
      break;
    case 'Single':
    case 'Multiple':
      if (question.Answers.length === 2) {
        toRender = <QuestionRadioButton question={question} />;
      } else {
        toRender = <QuestionSelect question={question} />;
      }
      break;
  }
  return toRender;
};

export default Question;
