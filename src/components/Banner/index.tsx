import classnames from 'classnames';
import * as React from 'react';
import './style.css';

interface BannerProps {
  className?: string;
  text?: string | React.ReactChild;
  title?: string;
  footer?: string | React.ReactChild;
  show?: boolean;
  error?: boolean;
  warning?: boolean;
}

export const Banner: React.SFC<BannerProps> = ({
  className,
  text,
  title,
  footer,
  show = true,
  error,
  warning,
  ...attributes
}) => {
  return (
    <div
      {...attributes}
      className={classnames('banner', className, {
        banner_error: error,
        banner_hidden: !show,
        banner_warning: warning
      })}
    >
      <div className="banner__bar" />
      {title && <div className="banner__title">{title}</div>}
      {text && <div className="banner__text">{text}</div>}
      {footer && <div className="banner__footer">{footer}</div>}
    </div>
  );
};

export default Banner;
