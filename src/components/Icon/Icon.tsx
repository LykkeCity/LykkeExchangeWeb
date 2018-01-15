import {rem} from 'polished';
import * as React from 'react';
import {fontSize} from '../Button';
import styled from '../styled';

interface IconProps {
  name: string;
  color?: string;
  size?: string;
}

const StyledIcon = styled.i`
  cursor: pointer;
  &:before {
    font-size: ${(props: any) => props.size};
    color: ${(props: any) => props.color};
  }
`;

const Icon = ({name, color, size}: IconProps) => (
  <StyledIcon
    {...{color, size: size ? fontSize[size] || `${rem(size)}` : fontSize.icon}}
    className={`icon icon--${name}`}
  />
);

export default Icon;
