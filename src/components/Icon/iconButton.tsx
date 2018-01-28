import * as React from 'react';
import styled from 'styled-components';
import {Icon} from '../Icon/index';
import {Theme} from '../theme';

const StyledButton = styled.button`
  cursor: pointer;
  padding: 0 !important;
  border: none;
  background: none;

  .icon:before {
    color: ${({theme}: Theme) => theme!.color.grayLight} !important;
  }

  &:hover,
  &:active,
  &:focus {
    .icon:before {
      color: ${({theme}: Theme) => theme!.color.secondary} !important;
    }
  }
`;

interface IconButtonProps {
  name: string;
  size?: string;
  onClick?: React.EventHandler<any>;
  className?: string;
}

const IconButton = (props: IconButtonProps) => (
  <StyledButton onClick={props.onClick} className={props.className}>
    <Icon name={props.name} size={props.size} />
  </StyledButton>
);

export default IconButton;
