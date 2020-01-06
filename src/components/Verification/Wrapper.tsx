import classNames from 'classnames';
import React from 'react';

interface WrapperProps {
  children: any;
  loading?: boolean;
}

const Spinner = () => (
  <div className="v_spinner_container">
    <div className="v_spinner">
      <div className="v_spinner__inside" />
    </div>
  </div>
);

export const Wrapper: React.SFC<WrapperProps> = ({loading, children}) => {
  return (
    <div className={classNames('wrapper', {open: loading})}>
      {children}
      {loading && <Spinner />}
      {loading && <div className="wrapper__overlay" />}
    </div>
  );
};

export default Wrapper;
