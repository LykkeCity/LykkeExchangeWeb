import * as React from 'react';

export interface WizardProps {
  activeIndex: number;
}

export const Wizard: React.SFC<WizardProps> = props => {
  const steps = ([] as Array<
    React.ReactElement<WizardStepProps>
  >).concat(props.children as Array<React.ReactElement<WizardStepProps>>);
  return steps
    .filter(x => x.props.index === props!.activeIndex)
    .map(x => (
      <WizardStep key={x.props.index} {...x.props} total={steps.length} />
    )) as any;
};

interface WizardStepProps {
  title: string;
  index: number;
  total?: number;
  onNext: any;
  onCancel: any;
}

export const WizardStep: React.SFC<WizardStepProps> = ({
  title,
  onCancel,
  onNext,
  index,
  total = 1,
  children
}) => (
  <div>
    <div className="step_title">
      <h4>{title}</h4>
      {total > 1 ? <small>{`Step ${index} of ${total}`}</small> : null}
    </div>
    {children}
  </div>
);

export default Wizard;
