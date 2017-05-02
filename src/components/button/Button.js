import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.css';

class Button extends Component {
  static propTypes = {
    cls: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    text: PropTypes.string,
  };

  static defaultProps = {
    cls: '',
    disabled: false,
  };

  render() {
    const { cls, text, disabled, onClick } = this.props;
    const _cls = classnames('btn', {
      disabled,
    }, cls);

    return (
      <button className={_cls} data-cmp="btn" onClick={onClick}>{text}</button>
    );
  }
}

export default Button;
