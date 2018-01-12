import {debounce} from 'lodash';
import * as React from 'react';
import SimpleDropdown, {
  DropdownContent,
  DropdownTrigger
} from 'react-simple-dropdown';
import {DropdownOverlay} from './index';

interface DropDownDefaultProps {
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
}

const DEFAULT_PROPS: DropDownDefaultProps = {
  mouseEnterDelay: 150,
  mouseLeaveDelay: 150 // should be more or equal mouseEnterDelay
};

export interface DropDownProps extends DropDownDefaultProps {
  className?: string;
  content: React.ReactNode;
  isOnClick?: boolean;
  isOnMouseOver?: boolean;
}

export default class Dropdown extends React.Component<
  DropDownProps,
  {isOpened: boolean}
> {
  static defaultProps = DEFAULT_PROPS;
  state = {isOpened: false};

  open = () => this.setState({isOpened: true});
  close = () => this.setState({isOpened: false});

  render() {
    const {
      content,
      children,
      className,
      mouseEnterDelay,
      mouseLeaveDelay,
      isOnClick
    } = this.props;

    const isOnMouseOver = this.props.isOnMouseOver || !isOnClick;

    return (
      <SimpleDropdown
        className={className}
        onMouseOver={isOnMouseOver && debounce(this.open, mouseEnterDelay)}
        onMouseEnter={isOnMouseOver && debounce(this.open, mouseEnterDelay)}
        onMouseLeave={isOnMouseOver && debounce(this.close, mouseLeaveDelay)}
        onShow={isOnClick && debounce(this.open, mouseEnterDelay)}
        onHide={isOnClick && debounce(this.close, mouseLeaveDelay)}
      >
        <DropdownTrigger>{children}</DropdownTrigger>
        <DropdownContent>
          {this.state.isOpened && <DropdownOverlay>{content}</DropdownOverlay>}
        </DropdownContent>
      </SimpleDropdown>
    );
  }
}
