import React from 'react';
import {Icon} from './';

interface OpenIconProps {
  isOpen: boolean;
}

const OpenIcon = ({isOpen}: OpenIconProps) => (
  <Icon name={isOpen ? 'chevron-thin-up' : 'chevron-thin-down'} />
);

export default OpenIcon;
