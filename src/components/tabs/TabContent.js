import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.css';

class TabContent extends Component {
  static propTypes = {
    active: PropTypes.bool,  // If true, the current component is visible.
    children: PropTypes.node,
    cls: PropTypes.string,  // Additional class name to provide custom styling.
    tabIndex: PropTypes.number,
  };

  static defaultProps = {
    active: false,
    cls: '',
  };

  render() {
    const { active, cls } = this.props;

    const _cls = classnames('content', {
      active,
    }, cls);

    return (
      <section className={_cls} tabIndex={this.props.tabIndex}>
        {this.props.children}
      </section>
    );
  }
}


export default TabContent;
