import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.css';

class Tab extends Component {
  static propTypes = {
    active: PropTypes.bool,  // If true, the current component is visible.
    cls: PropTypes.string,  // Additional class name to provide custom styling for each tab.
    disabled: PropTypes.bool,  // If true, the current component is not clickable.
    hidden: PropTypes.bool,  // If true, the current component is not visible.
    label: PropTypes.any.isRequired,  // Label text for navigation header. Required.
    onActive: PropTypes.func,  // Callback function that is fired when the tab is activated.
    onClick: PropTypes.func,  // Callback function that is fired when the tab is clicked.
  };

  static defaultProps = {
    active: false,
    cls: '',
    disabled: false,
    hidden: false,
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.active && this.props.active && this.props.onActive) {
      this.props.onActive();
    }
  }

  handleClick = (event) => {
    if (!this.props.disabled && this.props.onClick) {
      this.props.onClick(event);
    }
  };

  render() {
    const { active, hidden, disabled, cls } = this.props;

    const _cls = classnames('label', {
      active,
      hidden,
      disabled,
    }, cls);

    return (
      <label className={_cls} onClick={this.handleClick}>
        {this.props.label}
      </label>
    );
  }
}

export default Tab;
