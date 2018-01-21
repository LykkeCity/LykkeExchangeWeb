import {parseToRgb, rgba} from 'polished';
import styled from 'styled-components';
import {Theme} from '../theme';

const StyledDiv = styled.aside`
  position: fixed;
  z-index: 114;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  visibility: visible;
  opacity: 1;
  background: ${({theme}: Theme) =>
    rgba({...parseToRgb(theme!.color.gray25), alpha: 0.5})};

  @media all and (min-width: ${({theme}: Theme) => theme!.screenMobile} + 1) {
    transition: ${({theme}: Theme) => theme!.transitionAll};
  }
`;

export default StyledDiv;
