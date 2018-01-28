import {rem} from 'polished';
import React from 'react';
import {Button} from '../Button';
import styled from '../styled';
import {Theme} from '../theme';

const StyledButton = styled(Button)`
    position: relative;
    width: 30px;
    height: 30px;
    padding: 3.5px;

    &:after,
    &:before,
    span {
      content: '';
      position: absolute;
      border-radius: ${({theme}: Theme) => theme!.borderRadius};
      background: ${({theme}: Theme) => theme!.color.grayDark};
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      width: 18px;
      height: 2px;

      transition: background ${({theme}: Theme) => theme!.transitionDefault};
    }

    &:after {
      margin-top: -5px;
    }

    &:before {
      margin-top: 5px;
    }

    &:hover {
      &:after,
      &:before,
      span {
        background: ${({theme}: Theme) => theme!.color.secondary};
      }
    }
  }
`;

const StyledContainer = styled.div`
  display: inline-block;
  vertical-align: middle;

  margin-left: ${rem('-5px')};
  margin-right: ${rem('15px')};

  @media all and (max-width: ${({theme}: Theme) => theme!.screenMobile}) {
    margin-top: 2px;
  }
`;

const MenuButton: React.SFC<any> = ({onToggle}) => (
  <StyledContainer>
    <StyledButton shape="flat" onClick={onToggle}>
      <span />
    </StyledButton>
  </StyledContainer>
);

export default MenuButton;
