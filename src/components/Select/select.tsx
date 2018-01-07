import {rem} from 'polished';
import * as React from 'react';
import ReactSelect, {ReactSelectProps} from 'react-select';
import 'react-select/dist/react-select.css';
import {OpenIcon} from '../Icon';
import styled from '../styled';

const StyledReactSelect = styled(ReactSelect)`
  font-size: ${rem('16px')};
  text-align: left;
  color: ${props => props.theme.color.secondary};
  padding: 0;
  height: ${rem('50px')};

  & .Select-control {
    & .Select-value {
      padding: ${({valueRenderer}: ReactSelectProps) =>
        !!valueRenderer
          ? `${rem('10px')} ${rem('20px')} !important`
          : `${rem('16px')} ${rem('20px')} !important`};
      line-height: ${({valueRenderer}: ReactSelectProps) =>
        !!valueRenderer
          ? `${rem('25px')} !important`
          : `${rem('34px')} !important`}
      };
    }
  }

  &.is-focused:not(.is-open) > .Select-control {
    border-color: ${props => props.theme.color.grayDark};
    box-shadow: none;
  }

  & .Select-control,
  & .Select-placeholder {
    padding: ${rem('13px')} ${rem('20px')};
    line-height: ${rem('34px')};
  }

  & .Select-placeholder {
    padding: ${rem('16px')} ${rem('20px')};
  }

  & .Select-input {
    padding: 0;
  }

  & .Select-arrow {
    display: none;
  }

  & .Select-arrow-zone {
    color: ${props => props.theme.color.grayLight};
  }

  & .Select-menu-outer {
    border: none;
    border-radius: ${rem('4px')};
    top: ${rem('1px')};
    max-height: ${rem('270px')};
    box-shadow: 0 ${rem('8px')} ${rem('50px')} 0 rgba(63, 77, 96, 0.4),
      0 ${rem('5px')} ${rem('5px')} 0 rgba(63, 77, 96, 0.05);

    & > * {
      padding-top: ${rem('67px')};
    }
  }

  &.is-open {
    margin: 0 ${rem('-10px')};

    & .Select-control {
      padding: ${rem('13px')} ${rem('30px')};
    }

    & .Select-placeholder {
      padding: ${rem('16px')} ${rem('30px')};
    }

    .Select-input {
      border-radius: ${rem('4px')};
      width: calc(100% + ${rem('30px')});
      border: 1px solid ${props => props.theme.color.grayLight};
      padding: 0 ${rem('11px')};
      margin: 0 ${rem('-15px')};
    }
    & .Select-control {
      & .Select-value {
        padding: ${rem('13px')} ${rem('30px')} !important;
        line-height: ${({valueRenderer}: ReactSelectProps) =>
          !!valueRenderer
            ? `${rem('43px')} !important`
            : `${rem('40px')} !important`}
      }
      z-index: 2;
      border: 1px solid ${props => props.theme.color.white};
    }
    .Select-arrow-zone {
      display: none;
    }
    & .Select-option {
      border-radius: ${rem('4px')};
      margin: 0 ${rem('5px')};
      padding: ${rem('10px')} ${rem('15px')};
      font-size: ${rem('16px')};

      &.is-selected {
        background-color: ${props => props.theme.color.gray5};
        color: inherit;
      }

      &.is-focused {
        background-color: ${props => props.theme.color.primary};
        color: ${props => props.theme.color.white};
      }
    }
  }
`;

export interface SelectProps extends ReactSelectProps<any> {
  options: any[];
  value?: string;
  onChange?: any;
  className?: string;
}

export const Select: React.SFC<SelectProps> = ({
  options,
  value,
  onChange,
  className,
  ...rest
}) => (
  <StyledReactSelect
    value={value}
    options={options}
    onChange={onChange}
    className={className}
    // tslint:disable-next-line:jsx-no-lambda
    arrowRenderer={() => <OpenIcon isOpen={false} />}
    {...rest}
  />
);

export default Select;
