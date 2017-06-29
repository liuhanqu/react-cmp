import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import events from '../../utils/events';
import './style.css';


class Dropdown extends Component {
  static propTypes = {
    auto: PropTypes.bool,
    cls: PropTypes.string,  // Set the class to give custom styles to the dropdown.
    disabled: PropTypes.bool,  // Set the component as disabled.
    onChange: PropTypes.func,  // Callback function that is fired when the component's value changes.
    source: PropTypes.array.isRequired,  // Array of data objects with the data to represent in the dropdown.
    template: PropTypes.func, // Callback function that returns a JSX template to represent the element.
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),  // Default value using JSON data.
  };

  static defaultProps = {
    cls: '',
    disabled: false,
  };

  state = {
    active: false,
  };

  componentWillUpdate(nextProps, nextState) {
    if (!this.state.active && nextState.active) {
      events.addEventsToDocument({ click: this.handleDocumentClick });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.active && !this.state.active) {
      events.removeEventsFromDocument({ click: this.handleDocumentClick });
    }
  }

  componentWillUnmount() {
    if (this.state.active) {
      events.removeEventsFromDocument({ click: this.handleDocumentClick });
    }
  }

  getSelectedItem() {
    const { source, value } = this.props;
    let item = source.find(data => data.value === value);

    if (!item) {
      item = source[0];
    }

    return item;
  }

  handleDocumentClick = (event) => {
    if (this.state.active && !events.targetIsDescendant(event.target, ReactDOM.findDOMNode(this))) {
      this.setState({ active: false });
    }
  };

  handleMouseDown = (event) => {
    events.pauseEvent(event);
    this.open(event);
  };

  handleSelect = (item, event) => {
    if (!this.props.disabled && this.props.onChange) {
      this.props.onChange(item, event);
      this.close();
    }
  };

  open = (event) => {
    const client = event.target.getBoundingClientRect();
    const screenHeight = window.innerHeight || document.documentElement.offsetHeight;
    const up = this.props.auto ? client.top > ((screenHeight / 2) + client.height) : false;
    this.setState({
      active: true, up,
    });
  };

  close = () => {
    if (this.state.active) {
      this.setState({ active: false });
    }
  };

  renderTemplateValue(selected) {
    return (
      <div onMouseDown={this.handleMouseDown} className="templateValue">
        {this.props.template(selected)}
      </div>
    );
  }

  renderValue(item, idx) {
    const cls = item.value === this.props.value ? 'selected' : '';
    return (
      <li key={idx} className={cls} onMouseDown={this.handleSelect.bind(this, item)}>
        {this.props.template ? this.props.template(item) : item.text}
      </li>
    );
  }

  render() {
    const { cls, source, template, disabled } = this.props;
    const { active, up } = this.state;
    const selected = this.getSelectedItem();

    const _cls = classnames('dropdown', {
      active,
      up,
      disabled,
    }, cls);

    return (
      <div className={_cls} data-cmp="dropdown">
        <input
          className="value"
          onMouseDown={this.handleMouseDown}
          readOnly
          type={template && selected ? 'hidden' : null}
          value={selected && selected.text}
        />
        {template && selected ? this.renderTemplateValue(selected) : null}
        <ul className="values">
          {source.map(this.renderValue.bind(this))}
        </ul>
      </div>
    );
  }

}


export default Dropdown;
