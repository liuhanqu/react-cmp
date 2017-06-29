import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './style.less';

class Checkbox extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    children: PropTypes.node,
    cls: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    disabled: false,
  };

  handleToggle = () => {
    const { checked, disabled, onChange } = this.props;
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  render() {
    const { cls, disabled, label, children, checked } = this.props;

    const _cls = classnames('checkbox', {
      disabled,
      checked,
    }, cls);

    return (
      <label className={_cls} data-cmp="checkbox">
        <input
          disabled={disabled}
          checked={checked}
          className="input"
          type="checkbox"
          onChange={this.handleToggle}
        />
        <span className="check" />
        { label
          ? <span>{label}</span>
          : null
        }
        {children}
      </label>
    )
  }
}

export default Checkbox;
