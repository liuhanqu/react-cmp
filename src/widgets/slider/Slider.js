import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import events from '../../utils/events';
import { round, range } from '../../utils/utils';
import './style.css';

class Slider extends Component {
  static propTypes = {
    cls: PropTypes.string,
    disabled: PropTypes.bool,
    max: PropTypes.number,
    min: PropTypes.number,
    onAfterChange: PropTypes.func,
    onChange: PropTypes.func,
    snaps: PropTypes.bool,
    step: PropTypes.number,
    tip: PropTypes.bool,
    value: PropTypes.number,
  };

  static defaultProps = {
    cls: '',
    max: 100,
    min: 0,
    disabled: false,
    snaps: false,
    step: 0.01,
    value: 0,
  };

  state = {
    sliderLength: 0,
    sliderStart: 0,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    events.removeEventsFromDocument(this.getMouseEventMap());
  }

  getMouseEventMap() {
    return {
      mousemove: this.handleMouseMove,
      mouseup: this.handleMouseUp,
    };
  }

  getValue(event) {
    const position = events.getMousePosition(event);
    const value = this.positionToValue(position);
    return value;
  }

  handleResize = (event, callback) => {
    const { left, right } = this.progressbar.getBoundingClientRect();
    const cb = (callback) || (() => {});
    this.setState({ sliderStart: left, sliderLength: right - left }, cb);
  };

  handleMouseDown = (event) => {
    const newValue = this.getValue(event);
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
    events.addEventsToDocument(this.getMouseEventMap());
    this.setState({ pressed: true });
  };

  handleMouseMove = (event) => {
    const newValue = this.getValue(event);
    if (newValue !== this.props.value) {
      this.props.onChange(newValue);
    }
  };

  handleMouseUp = () => {
    events.removeEventsFromDocument(this.getMouseEventMap());
    if (this.props.onAfterChange) {
      this.props.onAfterChange(this.props.value);
    }
    this.setState({ pressed: false });
  };

  positionToValue(position) {
    const { sliderStart: start, sliderLength: length } = this.state;
    const { min, max, step } = this.props;
    const pos = ((position.x - start) / length) * (max - min);
    return this.trimValue((Math.round(pos / step) * step) + min);
  }

  trimValue(value) {
    if (value < this.props.min) return this.props.min;
    if (value > this.props.max) return this.props.max;
    return round(value, this.stepDecimals());
  }

  stepDecimals() {
    return (this.props.step.toString().split('.')[1] || []).length;
  }

  knobOffset() {
    const { min, max } = this.props;
    const translated = (this.state.sliderLength * (this.props.value - min)) / (max - min);
    return (translated * 100) / this.state.sliderLength;
  }

  calculateRatio() {
    const value = this.props.value;
    if (value < this.props.min) return 0;
    if (value > this.props.max) return 1;
    return (value - this.props.min) / (this.props.max - this.props.min);
  }

  renderSnaps() {
    if (!this.props.snaps) {
      return null;
    }

    return (
      <div className="snaps">
        {range(0, (this.props.max - this.props.min) / this.props.step).map(i =>
          <div key={`span-${i}`} className="snap" />,
        )}
      </div>
    );
  }

  render() {
    const knobStyles = { left: `${this.knobOffset()}%` };
    const valueStyles = { transform: `scaleX(${this.calculateRatio()})` };

    const { disabled, tip, cls, value, min, max } = this.props;

    const _cls = classnames('slider', {
      disabled,
      pressed: this.state.pressed,
      pinned: tip,
    }, cls);

    return (
      <div
        className={_cls}
        data-cmp="slider"
        onMouseDown={this.handleMouseDown}
      >
        <div className="container">
          <div
            className="knob"
            style={knobStyles}
            onMouseDown={this.handleMouseDown}
          >
            <div className="inner-knob" />
            <span className="tooltip">{value}</span>
          </div>
          <div className="progress">
            <div
              ref={(node) => { this.progressbar = node; }}
              className="progress-bar"
              aria-valuenow={value}
              aria-valuemin={min}
              aria-valuemax={max}
            >
              <span data-ref="value" className="value" style={valueStyles} />
            </div>
            {this.renderSnaps()}
          </div>
        </div>
      </div>
    );
  }
}


export default Slider;
