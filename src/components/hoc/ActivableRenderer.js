import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ActivableRendererFactory = (options = { delay: 200 }) => ActivableComponent =>
  class ActivableRenderer extends Component {
    static propTypes = {
      active: PropTypes.bool.isRequired,
      children: PropTypes.any,
      delay: PropTypes.number,
    };

    static defaultProps = {
      delay: options.delay,
    };

    state = {
      active: this.props.active,
      rendered: this.props.active,
    };

    componentWillReceiveProps(nextProps) {
      if (nextProps.active && !this.props.active) {
        this.renderAndActivate();
      }
      if (!nextProps.active && this.props.active) {
        this.deactivateAndUnrender();
      }
    }

    renderAndActivate() {
      if (this.unrenderTimeout) {
        clearTimeout(this.unrenderTimeout);
      }
      this.setState({
        rendered: true,
        active: false,
      }, () => {
        setTimeout(() => {
          this.setState({ active: true });
        }, 20);
      });
    }

    deactivateAndUnrender() {
      this.setState({
        rendered: true,
        active: false,
      }, () => {
        this.unrenderTimeout = setTimeout(() => {
          this.setState({ rendered: false });
          this.unrenderTimeout = null;
        }, this.props.delay);
      });
    }

    render() {
      const { delay, ...others } = this.props;
      const { active, rendered } = this.state;

      return (
        rendered
          ? <ActivableComponent {...others} active={active} />
          : null
      );
    }
  };


export default ActivableRendererFactory;
