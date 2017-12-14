import * as React from 'react';
import styled from '../styled';

interface IconProps {
  name: string;
  color?: string;
}

const StyledIcon = styled.i`
  cursor: pointer;
  color: ${(props: any) => props.color};
`;

const Icon = ({name, color}: IconProps) => (
  <StyledIcon color={color} className={`icon icon-${name}`} />
);

export default Icon;
