import {rem} from 'polished';
import {DropdownContent} from 'react-simple-dropdown';
import styled from 'styled-components';

const DropdownOverlay = styled(DropdownContent)`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 5px 5px rgba(63, 77, 96, 0.05), 0 0 20px rgba(63, 77, 96, 0.15);
  font-size: ${rem('13px')};
  padding: ${rem('5px')};

  position: absolute;
  z-index: 1;
  min-width: 120px;
  text-align: left;

  @media (max-width: ${props => props.theme.screenTablet}) {
    right: 0;
    margin-right: 15px;
  }
`;

export default DropdownOverlay;
