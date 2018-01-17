import {borderRadius, rem} from 'polished';
import * as React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {Theme} from '../theme';

export type ButtonType = 'button' | 'submit';
export type ButtonShape = 'default' | 'circle' | 'flat';
export type ButtonSize = 'mini' | 'small' | 'default' | 'large';

const allSides = ['top', 'right', 'bottom', 'left'];

export const fontSize = {
  default: rem('16px'),
  icon: rem('24px'),
  large: rem('18px'),
  mini: rem('14px'),
  small: rem('14px')
};

const buttonPadding = {
  default: `${rem('15px')} ${rem('40px')}`,
  large: `${rem('15px')} ${rem('50px')}`,
  mini: `${rem('7px')} ${rem('20px')}`,
  small: `${rem('10px')} ${rem('30px')}`
};

const StyledButton = styled.button`
  font-weight: ${({theme}: Theme) => theme!.fwSemi};
  font-size: ${(props: ButtonProps) =>
    props.size ? fontSize[props.size] : fontSize.default};
  background: ${({theme}: Theme) => theme!.color.primary};
  color: ${({theme}: Theme) => theme!.color.white};
  cursor: pointer;
  letter-spacing: 0;
  position: relative;
  overflow: hidden;
  display: inline-block;
  border: 0;
  text-decoration: none;

  min-width: ${(props: any) => `${props.width ? props.width : 40}px`};

  padding: ${(props: ButtonProps) =>
    props.size ? buttonPadding[props.size] : buttonPadding.default};

  white-space: nowrap;
  user-select: none;
  outline-style: none;
  text-decoration: none;

  ${allSides.map(s => borderRadius(s, '100px')) as any};
  box-shadow: none;

  white-space: nowrap;
  user-select: none;
  outline-style: none;

  &:not([disabled]):hover {
    background: ${({theme}: Theme) => theme!.color.active};
  }

  &[disabled] {
    cursor: not-allowed;
    background: ${({theme}: Theme) => theme!.color.disabled} !important;
    color: rgba(63, 77, 96, 0.3) !important;
    opacity: 1;
  }

  .icon {
    color: white !important;
    font-size: 1.2rem;
    margin-top: -0.1rem;
    margin-right: 0;
  }

  @media (max-width: ${({theme}: Theme) => theme!.screenDesktop}) {
    min-width: ${props => (props.width ? '100%' : 'inherit')};
  }
`;

const StyledCircleButton = styled(StyledButton)`
  line-height: 1.7em;

  line-height: normal;
  height: ${rem('40px')};
  width: ${rem('40px')};
  min-width: 0;

  padding: ${rem('5px')};

  .icon {
    &:before {
      font-size: 1rem;
    }
    margin: 0;
  }
`;

const flatButtonPadding = {
  default: `${rem('15px')} ${rem('30px')}`
};

const StyledFlatButton = styled(StyledButton)`
  background: transparent !important;
  color: ${({theme}: Theme) => theme!.color.primary} !important;

  &:not([disabled]):hover {
    color: ${({theme}: Theme) => theme!.color.active} !important;
  }

  padding: ${(props: ButtonProps) =>
    props.size
      ? flatButtonPadding[props.size] || buttonPadding[props.size]
      : flatButtonPadding.default};
`;

const componentByShape = {
  circle: StyledCircleButton,
  default: StyledButton,
  flat: StyledFlatButton
};

export interface ButtonProps {
  to?: string;
  type?: ButtonType;
  size?: ButtonSize;
  width?: number;
  shape?: ButtonShape;
  onClick?: React.FormEventHandler<any>;
  onMouseUp?: React.FormEventHandler<any>;
  onMouseDown?: React.FormEventHandler<any>;
  disabled?: boolean;
  className?: string;
}

class Button extends React.Component<ButtonProps, any> {
  render() {
    const {to, shape = 'default'} = this.props;

    const ButtonComponent = componentByShape[shape] || StyledButton;
    const button = <ButtonComponent {...this.props} />;

    return to ? <Link to={to}>{button}</Link> : button;
  }
}

export default Button;
