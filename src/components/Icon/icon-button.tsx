import * as React from 'react';
import styled from 'styled-components';
import {Icon} from '../Icon/index';

const StyledButton = styled.button`
  padding: 0 !important;
  border: none;
  background: none;

  span {
    color: ${props => props.theme.color.grayLight};
  }
  .icon:before {
    color: ${props => props.theme.color.grayLight} !important;
  }

  &:hover,
  &:active,
  &:focus {
    span {
      color: ${props => props.theme.color.grayDark};
    }
    .icon:before {
      color: ${props => props.theme.color.grayDark} !important;
    }
  }
`;

interface IconButtonProps {
  name: string;
  size?: string;
  onClick?: React.EventHandler<any>;
  className?: string;
  children?: any;
}

const IconButton = (props: IconButtonProps) => (
  <StyledButton onClick={props.onClick} className={props.className}>
    <Icon name={props.name} size={props.size} />
    {!!props.children && <span>{props.children}</span>}
  </StyledButton>
);

export default IconButton;
