import {rem} from 'polished';
import * as React from 'react';
import styled from '../styled';
import {ThemeInterface} from '../theme';

type ValuePosition = 'right' | 'bottom';

export interface SelectItemProps {
  name: string;
  children: any;
  isGroup?: boolean;
  valuePosition?: ValuePosition;
}

const flexDirection = {
  bottom: 'column',
  right: 'row'
};

const alignItems = {
  bottom: 'flex-start',
  right: 'center'
};

const justifyContent = {
  bottom: 'space-around',
  right: 'space-between'
};

export interface StyledNameProps {
  theme?: ThemeInterface;
  isGroup: boolean;
}

const StyledName = styled.div`
  text-transform: ${({isGroup, theme}: StyledNameProps) =>
    `${isGroup && 'uppercase'}`};
  color: ${({isGroup, theme}: StyledNameProps) =>
    `${isGroup && !!theme && theme.color.grayLight}`};
`;

const StyledSelectItem = styled.div`
  display: flex;
  flex-direction: ${({valuePosition = 'right'}: SelectItemProps) =>
    flexDirection[valuePosition]};
  align-items: ${({valuePosition = 'right'}: SelectItemProps) =>
    alignItems[valuePosition]};
  justify-content: ${({valuePosition = 'right'}: SelectItemProps) =>
    justifyContent[valuePosition]};
`;

export interface SelectItemValueProps {
  valuePosition: ValuePosition;
  theme?: ThemeInterface;
}

const StyledValue = styled.div`
  font-size: ${({valuePosition}: SelectItemValueProps) =>
    valuePosition === 'right' ? 'inherit' : rem('14px')};
  color: ${({valuePosition, theme}: SelectItemValueProps) =>
    valuePosition === 'right'
      ? 'inherit'
      : `${theme && theme.color.secondary}`};
  opacity: ${({valuePosition, theme}: SelectItemValueProps) =>
    valuePosition === 'right' ? 'inherit' : 0.6};
`;

export const SelectItem = ({
  name,
  isGroup = false,
  children,
  valuePosition = 'right'
}: SelectItemProps) => (
  <StyledSelectItem {...{name, valuePosition}}>
    <StyledName isGroup={isGroup}>{name}</StyledName>
    {!isGroup && (
      <StyledValue valuePosition={valuePosition}>{children}</StyledValue>
    )}
  </StyledSelectItem>
);

export default SelectItem;
