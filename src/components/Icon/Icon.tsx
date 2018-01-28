import {rem} from 'polished';
import * as React from 'react';
import {fontSize} from '../Button';
import styled from '../styled';

interface StyledIconProps {
  color?: string;
  size: string;
}

const StyledIcon = styled.i`
  &:before {
    font-size: ${(props: StyledIconProps) => props.size};
    color: ${(props: StyledIconProps) => props.color || ''} !important;
  }
`;

interface IconProps {
  name: string;
  color?: string;
  size?: string;
}

const Icon = ({name, color, size}: IconProps) => (
  <StyledIcon
    {...{
      color,
      size: !!size ? fontSize[size] || `${rem(size)}` : fontSize.icon
    }}
    className={`icon icon--${name}`}
  />
);

export default Icon;
