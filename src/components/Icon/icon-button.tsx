import * as React from 'react';
import styled from 'styled-components';
import {Icon} from '../Icon/index';

const StyledButton = styled.button`
  padding: 0 !important;
  border: none;
  background: none;

  .icon:before {
    color: #b2b8bf !important;
  }

  &:hover,
  &:active,
  &:focus {
    .icon:before {
      color: #3f4d60 !important;
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
