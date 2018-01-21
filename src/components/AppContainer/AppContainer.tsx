import * as React from 'react';
import styled from 'styled-components';
import {SidebarOverlay} from './';

interface AppContainerProps {
  isOverlayed: boolean;
  onClick: (e: React.MouseEvent<any>) => void;
}

const Container: React.SFC<AppContainerProps> = ({isOverlayed, ...rest}) => (
  <div {...rest} />
);

const blur = (isOn: boolean) => (isOn ? 'blur(5px)' : '');

const StyledContainer = styled(Container)`
  -webkit-filter: ${({isOverlayed}: AppContainerProps) => blur(isOverlayed)};
  filter: ${({isOverlayed}: AppContainerProps) => blur(isOverlayed)};
`;

const AppContainer: React.SFC<AppContainerProps> = props => {
  const {isOverlayed, children} = props;
  return (
    <StyledContainer {...props}>
      {isOverlayed && <SidebarOverlay />}
      {children}
    </StyledContainer>
  );
};

export default AppContainer;
