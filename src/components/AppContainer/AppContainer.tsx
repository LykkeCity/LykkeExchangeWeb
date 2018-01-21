import * as React from 'react';
import styled from 'styled-components';
import {MenuOverlay} from './';

interface AppContainerProps {
  isOverlayed: boolean;
  onClick: (e: React.MouseEvent<any>) => void;
}

const AppContainer: React.SFC<AppContainerProps> = props => {
  const {isOverlayed, children} = props;
  return (
    <div {...props}>
      {isOverlayed && <MenuOverlay />}
      {children}
    </div>
  );
};

const blur = (isOn: boolean) => (isOn ? 'blur(5px)' : '');

const StyledAppContainer = styled(AppContainer)`
  -webkit-filter: ${({isOverlayed}: AppContainerProps) => blur(isOverlayed)};
  filter: ${({isOverlayed}: AppContainerProps) => blur(isOverlayed)};
`;

export default StyledAppContainer;
