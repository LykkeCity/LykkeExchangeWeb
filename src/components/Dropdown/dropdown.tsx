import * as React from 'react';
import styled from '../styled';

const StyledOverlayContainer = styled.div`
  position: absolute;
  z-index: 1;
  min-width: 120px;
  text-align: left;

  @media (max-width: ${props => props.theme.screenTablet}) {
    right: 0;
    margin-right: 15px;
  }
`;

export enum DROPDOWN_TRIGGER {
  CLICK = 'click',
  HOVER = 'hover'
}

export enum DEFAULT_PROPS {
  mouseEnterDelay = 0.15,
  mouseLeaveDelay = 0.1
}

type EventType = DROPDOWN_TRIGGER.CLICK | DROPDOWN_TRIGGER.HOVER;

export interface DropDownProps {
  trigger?: EventType[];
  overlay: React.ReactNode;
  className?: string;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
}

export default class Dropdown extends React.Component<DropDownProps, any> {
  static defaultProps = DEFAULT_PROPS;
  enterDelay: number;
  leaveDelay: number;

  constructor(props: DropDownProps) {
    super(props);
    this.state = {
      isTriggerHovered: false, 
      isOverlayHovered: false
    };
    this.handleTriggerMouseOver = this.handleTriggerMouseOver.bind(this);
    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleTriggerMouseLeave = this.handleTriggerMouseLeave.bind(this);
    this.handleOverlayMouseOver = this.handleOverlayMouseOver.bind(this);
    this.handleOverlayMouseLeave = this.handleOverlayMouseLeave.bind(this);
    this.enterDelay = 1000 * (this.props.mouseEnterDelay || DEFAULT_PROPS.mouseEnterDelay);
    this.leaveDelay = 1000 * (this.props.mouseLeaveDelay || DEFAULT_PROPS.mouseLeaveDelay);
  }

  handleTriggerClick() {
    this.toggle();
  }

  handleOverlayMouseOver() {
    this.setState({isOverlayHovered: true, isTriggerHovered: false});
  }

  handleOverlayMouseLeave() {
    this.setState({isOverlayHovered: false});
  }

  handleTriggerMouseOver(event: React.MouseEvent<any>) {
    if (!this.state.isTriggerHovered) {
      this.delayedOpen();
    }
  }

  handleTriggerMouseLeave() {
    if (this.state.isTriggerHovered) {
      this.delayedClose();
    }
  }

  delayedOpen() {
    setTimeout(() => this.open(), this.enterDelay);
  }

  delayedClose() {
    setTimeout(() => this.close(), this.leaveDelay);
  }

  toggle() {
    const {isTriggerHovered} = this.state;
    isTriggerHovered ? this.close() : this.open();
  }

  open() {
    this.setState({isTriggerHovered: true});
  }

  close() {
    this.setState({isTriggerHovered: false});
  }

  setTriggerEvents() {
    const {trigger = []} = this.props;
    let setTriggers = {};

    trigger.forEach(eventType => {
      switch (eventType) {
        case DROPDOWN_TRIGGER.HOVER:
          setTriggers = {
            ...setTriggers,
            ...{
              onMouseOver: this.handleTriggerMouseOver
            }
          };
          break;
        case DROPDOWN_TRIGGER.CLICK:
          setTriggers = {...setTriggers, ...{onClick: this.handleTriggerClick}};
          break;
      }
    });
    return {...setTriggers, ...{onMouseLeave: this.handleTriggerMouseLeave}};
  }

  render() {
    const {overlay, children} = this.props;
    const {isTriggerHovered, isOverlayHovered} = this.state;

    const overlayWithEvents = React.cloneElement(overlay as any, {
      onMouseLeave: this.handleOverlayMouseLeave,
      onMouseOver: this.handleOverlayMouseOver
    });
    const trigger = React.cloneElement(children as any, {
      ...this.setTriggerEvents()
    });

    return (
      <div>
        {trigger}
        {isTriggerHovered || isOverlayHovered ? (
          <StyledOverlayContainer>{overlayWithEvents}</StyledOverlayContainer>
        ) : null}
      </div>
    );
  }
}
