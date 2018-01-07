import {rem} from 'polished';
import * as React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

const StyledDropdownItem = styled.div``;

const linkStyle = `
  cursor: pointer;
  display: block;
  width: 100%;
  padding: ${rem(15)} !important;
  border-radius: 4px;

  &:hover {
    background: #f5f6f7;
  }
  &:focus {
    text-decoration: none;
  }

  color: #333333;
  text-transform: uppercase;
`;

const StyledLink = styled(Link)`
  ${linkStyle};
`;
const StyledA = styled.a`
  ${linkStyle};
`;
const StyledSpan = styled.span`
  ${linkStyle};
`;

interface DropdownItemProps {
  to?: string;
  onClick?: React.MouseEventHandler<any>;
  children: any;
}

const DropdownItem = ({to, children, onClick}: DropdownItemProps) => {
  const link = () => {
    if (to) {
      return <StyledLink to={to}>{children}</StyledLink>;
    } else if (onClick) {
      return <StyledA {...{onClick}}>{children}</StyledA>;
    } else {
      return <StyledSpan>{children}</StyledSpan>;
    }
  };

  return <StyledDropdownItem {...{children: link()}} />;
};

export default DropdownItem;
