import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import events from 'utils/events';
import { getViewport } from 'utils/utils';

import Portal from '../hoc/Portal';
import './style.css';

const POSITION = ['top', 'right', 'left', 'bottom'];

const tooltipFactory = ComposedComponent => (
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
        tooltipPosition: PropTypes.oneOf(POSITION),
      };

      static defaultProps = {
        cls: '',
        tooltipDelay: 0,
        tooltipHideOnClick: true,
        tooltipPosition: 'top',
      };

      state = {
        active: false,
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

      activate({ top, left, position }) {
        if (this.timeout) clearTimeout(this.timeout);
        this.setState({ visible: true });
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
        const position = this.props.tooltipPosition;
        const { top, left, height, width } = element.getBoundingClientRect();
        const xOffset = window.scrollX || window.pageXOffset;
        const yOffset = window.scrollY || window.pageYOffset;
        if (position === "bottom") {
          return {
            top: top + height + yOffset,
            left: left + (width / 2) + xOffset,
          };
        } else if (position === "top") {
          return {
            top: top + yOffset,
            left: left + (width / 2) + xOffset,
          };
        } else if (position === "left") {
          return {
            top: top + (height / 2) + yOffset,
            left: left + xOffset,
          };
        } else if (position === "right") {
          return {
            top: top + (height / 2) + yOffset,
            left: left + width + xOffset,
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

        if (this.props.onClick) this.props.onClick(event);
      };

      render() {
        const { active, left, top, visible } = this.state;
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
          ...other
        } = this.props;

        const positionClass = `tooltip${tooltipPosition.charAt(0).toUpperCase() + tooltipPosition.slice(1)}`;

        const _cls = classnames('tooltip', {
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
  )


export default tooltipFactory;
