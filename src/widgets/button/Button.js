import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import IconFont from '../iconfont';

import './style.css';

class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
    cls: PropTypes.string,
    disabled: PropTypes.bool,
    href: PropTypes.string,
    icon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    label: PropTypes.string,
  };

  static defaultProps = {
    cls: '',
    disabled: false,
  };

  render() {
    const { cls, label, disabled, children, icon, href, ...other } = this.props;

    const _cls = classnames('btn', {
      disabled,
    }, cls);

    const element = href ? 'a' : 'button';

    const props = {
      ...other,
      href,
      className: _cls,
      'data-cmp': 'button',
    }

    const iconElement = typeof icon === 'string'
      ? <IconFont value={icon} />
      : icon;

    return React.createElement(element, props,
      icon ? iconElement : null,
      label,
      children
    )
  }
}

export default Button;
