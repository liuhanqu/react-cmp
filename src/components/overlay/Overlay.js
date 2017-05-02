import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.css';


class Overlay extends Component {
  static propTypes = {
    active: PropTypes.bool,
    cls: PropTypes.string,
    lockScroll: PropTypes.bool,
    onClick: PropTypes.func,
    onEscKeyDown: PropTypes.func,
  };

  static defaultProps = {
    lockScroll: true,
  };

  componentDidMount() {
    const { active, lockScroll, onEscKeyDown } = this.props;
    if (onEscKeyDown) {
      document.body.addEventListener('keydown', this.handleEscKey);
    }
    if (active && lockScroll) {
      document.body.style.overflow = 'hidden';
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.lockScroll) {
      const becomingActive = nextProps.active && !this.props.active;
      const becomingUnactive = !nextProps.active && this.props.active;

      if (becomingActive) {
        document.body.style.overflow = 'hidden';
      }

      if (becomingUnactive && !document.querySelectorAll('[data-cmp="overlay"]')[1]) {
        document.body.style.overflow = '';
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.onEscKeyDown) {
      if (this.props.active && !prevProps.active) {
        document.body.addEventListener('keydown', this.handleEscKey);
      } else if (!this.props.active && prevProps.active) {
        document.body.removeEventListener('keydown', this.handleEscKey);
      }
    }
  }

  componentWillUnmount() {
    if (this.props.active && this.props.lockScroll) {
      if (!document.querySelectorAll('[data-react-toolbox="overlay"]')[1]) {
        document.body.style.overflow = '';
      }
    }

    if (this.props.onEscKeyDown) {
      document.body.removeEventListener('keydown', this.handleEscKey);
    }
  }

  handleEscKey = (e) => {
    if (this.props.active && this.props.onEscKeyDown && e.which === 27) {
      this.props.onEscKeyDown(e);
    }
  };

  handleClick = (e) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };

  render() {
    const { active, cls } = this.props;
    const _cls = classnames('overlay', {
      active,
    }, cls);

    return (
      <div
        className={_cls}
        onClick={this.handleClick}
      />
    );
  }

}


export default Overlay;
