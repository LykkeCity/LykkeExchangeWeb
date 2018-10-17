import classnames from 'classnames';
import * as React from 'react';
import Banner from './';

interface TfaDisabledBannerProps {
  className?: string;
  show?: boolean;
}

export const TfaDisabledBanner: React.SFC<TfaDisabledBannerProps> = ({
  className,
  show,
  ...attributes
}) => {
  return (
    <Banner
      {...attributes}
      title="2FA was disabled"
      warning
      show={show}
      text={
        <div>
          It seems like after exceeding the number of unsuccessful attempts,
          your 2fa was disabled for security reasons. Please contact support at{' '}
          <a href="mailto:support@lykke.com">support@lykke.com</a>
        </div>
      }
      className={classnames('banner_tfa-disabled', className)}
    />
  );
};

export default TfaDisabledBanner;
