import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import events from 'utils/events';
import { getViewport } from 'utils/utils';

import Portal from '../hoc/Portal';
import './style.css';

const POSITION = {
  BOTTOM: 'bottom',
  HORIZONTAL: 'horizontal',
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
  VERTICAL: 'vertical',
};

const defaults = {
  cls: '',
  delay: 0,
  hideOnClick: true,
  passthrough: true,
  showOnClick: false,
  position: POSITION.VERTICAL,
};


const tooltipFactory = (options = {}) => {
  const {
    cls: defaultCls,
    delay: defaultDelay,
    hideOnClick: defaultHideOnClick,
    // passthrough: defaultPassthrough,
    position: defaultPosition,
    showOnClick: defaultShowOnClick,
  } = { ...defaults, ...options };

  return (ComposedComponent) => {
    class TooltippedComponent extends Component {
      static propTypes = {
        children: PropTypes.node,
        cls: PropTypes.string,
        onClick: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        tooltip: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.node,
        ]),
        tooltipDelay: PropTypes.number,
        tooltipHideOnClick: PropTypes.bool,
        tooltipPosition: PropTypes.oneOf(Object.keys(POSITION).map(key => POSITION[key])),
        tooltipShowOnClick: PropTypes.bool,
      };

      static defaultProps = {
        cls: defaultCls,
        tooltipDelay: defaultDelay,
        tooltipHideOnClick: defaultHideOnClick,
        tooltipPosition: defaultPosition,
        tooltipShowOnClick: defaultShowOnClick,
      };

      state = {
        active: false,
        position: this.props.tooltipPosition,
        visible: false,
      };

      componentWillUnmount() {
        if (this.tooltipNode) {
          events.removeEventListenerOnTransitionEnded(this.tooltipNode, this.onTransformEnd);
        }
        if (this.timeout) clearTimeout(this.timeout);
      }

      onTransformEnd = (e) => {
        if (e.propertyName === 'transform') {
          events.removeEventListenerOnTransitionEnded(this.tooltipNode, this.onTransformEnd);
          this.setState({ visible: false });
        }
      };

      getPosition(element) {
        const { tooltipPosition } = this.props;
        if (tooltipPosition === POSITION.HORIZONTAL) {
          const origin = element.getBoundingClientRect();
          const { width: ww } = getViewport();
          const toRight = origin.left < ((ww / 2) - (origin.width / 2));
          return toRight ? POSITION.RIGHT : POSITION.LEFT;
        } else if (tooltipPosition === POSITION.VERTICAL) {
          const origin = element.getBoundingClientRect();
          const { height: wh } = getViewport();
          const toBottom = origin.top < ((wh / 2) - (origin.height / 2));
          return toBottom ? POSITION.BOTTOM : POSITION.TOP;
        }
        return tooltipPosition;
      }

      activate({ top, left, position }) {
        if (this.timeout) clearTimeout(this.timeout);
        this.setState({ visible: true, position });
        this.timeout = setTimeout(() => {
          this.setState({ active: true, top, left });
        }, this.props.tooltipDelay);
      }

      deactivate() {
        if (this.timeout) clearTimeout(this.timeout);
        if (this.state.active) {
          events.addEventListenerOnTransitionEnded(this.tooltipNode, this.onTransformEnd);
          this.setState({ active: false });
        } else if (this.state.visible) {
          this.setState({ visible: false });
        }
      }

      calculatePosition(element) {
        const position = this.getPosition(element);
        const { top, left, height, width } = element.getBoundingClientRect();
        const xOffset = window.scrollX || window.pageXOffset;
        const yOffset = window.scrollY || window.pageYOffset;
        if (position === POSITION.BOTTOM) {
          return {
            top: top + height + yOffset,
            left: left + (width / 2) + xOffset,
            position,
          };
        } else if (position === POSITION.TOP) {
          return {
            top: top + yOffset,
            left: left + (width / 2) + xOffset,
            position,
          };
        } else if (position === POSITION.LEFT) {
          return {
            top: top + (height / 2) + yOffset,
            left: left + xOffset,
            position,
          };
        } else if (position === POSITION.RIGHT) {
          return {
            top: top + (height / 2) + yOffset,
            left: left + width + xOffset,
            position,
          };
        }
        return undefined;
      }

      handleMouseEnter = (event) => {
        this.activate(this.calculatePosition(event.currentTarget));
        if (this.props.onMouseEnter) this.props.onMouseEnter(event);
      };

      handleMouseLeave = (event) => {
        this.deactivate();
        if (this.props.onMouseLeave) this.props.onMouseLeave(event);
      };

      handleClick = (event) => {
        if (this.props.tooltipHideOnClick && this.state.active) {
          this.deactivate();
        }

        if (this.props.tooltipShowOnClick && !this.state.active) {
          this.activate(this.calculatePosition(event.currentTarget));
        }

        if (this.props.onClick) this.props.onClick(event);
      };

      render() {
        const { active, left, top, position, visible } = this.state;
        const positionClass = `tooltip${position.charAt(0).toUpperCase() + position.slice(1)}`;
        const {
          children,
          cls,
          onClick,
          onMouseEnter,
          onMouseLeave,
          tooltip,
          tooltipDelay,
          tooltipHideOnClick,
          tooltipPosition,
          tooltipShowOnClick,
          ...other
        } = this.props;

        const _cls = classnames(tooltip, {
          tooltipActive: active,
          [positionClass]: positionClass,
        });

        const childProps = {
          ...other,
          cls,
          onClick: this.handleClick,
          onMouseEnter: this.handleMouseEnter,
          onMouseLeave: this.handleMouseLeave,
        };

        return React.createElement(ComposedComponent, childProps, children,
          visible && (
            <Portal>
              <span
                ref={(node) => { this.tooltipNode = node; }}
                className={_cls}
                data-cmp="tooltip"
                style={{ top, left }}
              >
                <span className="tooltipInner">{tooltip}</span>
              </span>
            </Portal>
          ),
        );
      }
    }
    return TooltippedComponent;
  };
};

export default tooltipFactory;
