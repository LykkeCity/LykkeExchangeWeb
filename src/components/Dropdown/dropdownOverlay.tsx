import {rem} from 'polished';
import styled from 'styled-components';
import {Theme} from '../theme';

const DropdownOverlay = styled.div`
  background: ${({theme}: Theme) => theme!.color.white};
  border-radius: ${({theme}: Theme) => theme!.borderRadius};
  box-shadow: 0 5px 5px rgba(63, 77, 96, 0.05), 0 0 20px rgba(63, 77, 96, 0.15);
  font-size: ${rem('13px')};
  padding: ${rem('5px')};

  position: absolute;
  z-index: 1;
  white-space: nowrap;
  text-align: left;

  @media (max-width: ${({theme}: Theme) => theme!.screenTablet}) {
    right: 0;
    margin-right: 15px;
  }
`;

export default DropdownOverlay;
