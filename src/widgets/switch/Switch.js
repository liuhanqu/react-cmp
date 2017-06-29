import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.css';

class Switch extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    cls: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    checked: true,
    cls: '',
    disabled: false,
  };

  handleToggle = (event) => {
    const { disabled, checked, onChange } = this.props;
    if (!disabled && onChange) {
      onChange(!checked, event);
    }
  };

  render() {
    const { checked, cls, disabled, label } = this.props;
    const _cls = classnames(cls, {
      disabled,
    }, 'switch');
    return (
      <label className={_cls} data-cmp="switch">
        <input
          disabled={disabled}
          checked={checked}
          className="input"
          type="checkbox"
          onChange={this.handleToggle}
        />
        <span className={`track ${checked ? 'on' : 'off'}`}>
          <span className="thumb" />
        </span>
        { label
          ? <span className="text">{label}</span>
          : null
        }
      </label>
    );
  }
}

export default Switch;
