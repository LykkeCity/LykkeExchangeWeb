import classnames from 'classnames';
import * as React from 'react';
import {ClickOutside} from '../ClickOutside';
import './style.css';

export interface DropdownProps {
  children?: React.ReactChild | React.ReactChild[];
  className?: string;
  isOpen?: boolean;
  tag?: string;
  trigger?: string;
}

interface DropdownState {
  isOpen?: boolean;
}

export class Dropdown extends React.Component<DropdownProps, DropdownState> {
  constructor(props: DropdownProps) {
    super(props);

    this.state = {
      isOpen: props.isOpen
    };
  }

  handleClick = () => {
    if (this.props.trigger === 'click') {
      this.setState(prevState => ({
        isOpen: !prevState.isOpen
      }));
    }
  };

  handleClickOutside = () => {
    if (this.props.trigger === 'click') {
      this.setState({
        isOpen: false
      });
    }
  };

  render() {
    const {
      children,
      className,
      tag: Tag = 'div',
      trigger = 'hover',
      ...props
    } = this.props;

    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        <Tag
          {...props}
          onClick={this.handleClick}
          className={classnames(
            'dropdown',
            className,
            this.state.isOpen ? 'dropdown_open' : '',
            trigger === 'click' ? 'dropdown_clickable' : ''
          )}
        >
          {children}
        </Tag>
      </ClickOutside>
    );
  }
}

export default Dropdown;
