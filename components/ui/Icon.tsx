
import React from 'react';
import { ICONS } from '../../constants';

type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className }) => {
  const svg = ICONS[name];
  if (!svg) {
    return null;
  }
  return React.cloneElement(svg, { className });
};

export default Icon;
