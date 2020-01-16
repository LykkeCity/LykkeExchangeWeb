import classnames from 'classnames';
import React from 'react';
import {VerificationStatus} from '../../models';

interface StepItemProps {
  text: string;
  status: VerificationStatus;
  isActive: boolean;
}

const CLASS_MAP = {
  APPROVED: 'approved',
  EMPTY: 'empty',
  REJECTED: 'rejected',
  SUBMITTED: 'submitted'
};

const ICON_MAP = {
  APPROVED: `${process.env.PUBLIC_URL}/images/verify_approved.png`,
  EMPTY: `${process.env.PUBLIC_URL}/images/verify_empty.png`,
  REJECTED: `${process.env.PUBLIC_URL}/images/verify_rejected.png`,
  SUBMITTED: `${process.env.PUBLIC_URL}/images/verify_submitted.png`
};

export const StepItem: React.SFC<StepItemProps> = ({
  text,
  status,
  isActive
}) => (
  <div className="verification-item">
    <span className="verification-item__icon">
      <img src={ICON_MAP[status]} />
    </span>
    <span
      className={classnames('verification-item__text', CLASS_MAP[status], {
        active: isActive
      })}
    >
      {text}
    </span>
  </div>
);

export default StepItem;
