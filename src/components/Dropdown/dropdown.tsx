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

  open = debounce(
    () => this.setState({isOpened: true}),
    this.props.mouseEnterDelay
  );
  close = debounce(
    () => this.setState({isOpened: false}),
    this.props.mouseLeaveDelay
  );

  render() {
    const {content, children, className, isOnClick} = this.props;

    const isOnMouseOver = this.props.isOnMouseOver || !isOnClick;

    const moveHandlers = isOnMouseOver && {
      onMouseOver: this.open,
      onMouseEnter: this.open,
      onMouseLeave: this.close
    };

    const clickHandlers = isOnClick && {
      onShow: this.open,
      onHide: this.close
    };

    return (
      <SimpleDropdown
        className={className}
        {...moveHandlers}
        {...clickHandlers}
      >
        <DropdownTrigger>{children}</DropdownTrigger>
        <DropdownContent>
          {this.state.isOpened && <DropdownOverlay>{content}</DropdownOverlay>}
        </DropdownContent>
      </SimpleDropdown>
    );
  }
}
