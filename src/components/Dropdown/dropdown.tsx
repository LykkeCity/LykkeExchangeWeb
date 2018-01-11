import {debounce} from 'lodash';
import * as React from 'react';
import Dropdown, {
  DropdownContent,
  DropdownTrigger
} from 'react-simple-dropdown';

export enum DROPDOWN_TRIGGER {
  CLICK = 'click',
  HOVER = 'hover'
}

const DEFAULT_PROPS = {
  mouseEnterDelay: 150,
  mouseLeaveDelay: 150 // should be more or equal mouseEnterDelay
};

type EventType = DROPDOWN_TRIGGER.CLICK | DROPDOWN_TRIGGER.HOVER;

export interface DropDownProps {
  trigger?: EventType[];
  overlay: React.ReactNode;
  className?: string;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
}

export default class Dropdown2 extends React.Component<
  DropDownProps,
  {isOpened: boolean}
> {
  static defaultProps = DEFAULT_PROPS;
  state = {isOpened: false};

  open = () => this.setState({isOpened: true});
  close = () => this.setState({isOpened: false});

  get isClicked() {
    return this.isEventType(DROPDOWN_TRIGGER.CLICK);
  }
  get isHovered() {
    return this.isEventType(DROPDOWN_TRIGGER.HOVER);
  }

  isEventType(eventType: EventType) {
    const {trigger = []} = this.props;
    const found = trigger.filter(
      triggerEventType => triggerEventType === eventType
    );
    return found.length > 0;
  }

  render() {
    const {
      overlay,
      children,
      className,
      mouseEnterDelay,
      mouseLeaveDelay
    } = this.props;

    return (
      <Dropdown
        className={className}
        onMouseOver={this.isHovered && debounce(this.open, mouseEnterDelay)}
        onMouseEnter={this.isHovered && debounce(this.open, mouseEnterDelay)}
        onMouseLeave={this.isHovered && debounce(this.close, mouseLeaveDelay)}
        onShow={this.isClicked && debounce(this.open, mouseEnterDelay)}
        onHide={this.isClicked && debounce(this.close, mouseLeaveDelay)}
      >
        <DropdownTrigger>{children}</DropdownTrigger>
        <DropdownContent>{this.state.isOpened && overlay}</DropdownContent>
      </Dropdown>
    );
  }
}
