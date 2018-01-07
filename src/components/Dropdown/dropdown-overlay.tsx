import {rem} from 'polished';
import styled from 'styled-components';

const DropdownOverlay = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 5px 5px rgba(63, 77, 96, 0.05), 0 0 20px rgba(63, 77, 96, 0.15);
  font-size: ${rem(1)};
  padding: ${rem(5)};
`;

export default DropdownOverlay;
