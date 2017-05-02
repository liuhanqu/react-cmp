import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class RadioButton extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    children: PropTypes.any,
    cls: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
  };

  static defaultProps = {
    cls: '',
    checked: false,
    disabled: false,
  };

  handleChange = (event) => {
    const { checked, disabled, onChange } = this.props;
    if (!disabled && !checked && onChange) {
      onChange(event);
    }
  };


  render() {
    const { value, disabled, cls, checked, label, children, name } = this.props;

    const _cls = classnames('radio-button', {
      disabled,
      checked,
    }, cls);

    return (
      <label className={_cls}>
        <input
          className="input"
          type="radio"
          value={value}
          checked={checked}
          disabled={disabled}
          name={name}
          onChange={this.handleChange}
        />
        <span className="radio" />
        { label ? <span className="label">{label}</span> : null}
        {children}
      </label>
    );
  }
}
