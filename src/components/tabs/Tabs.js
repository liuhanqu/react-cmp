import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import InjectTab from './Tab';
import InjectTabContent from './TabContent';
import './style.css';

const factory = (Tab, TabContent) => {
  class Tabs extends Component {
    static propTypes = {
      children: PropTypes.node,
      cls: PropTypes.string,  // Additional class name to provide custom styling.
      index: PropTypes.number,  // Index of active tab
      onChange: PropTypes.func,  // Callback function that is fired when the tab changes.
    };

    static defaultProps = {
      cls: '',
      index: 0,
    };

    handleHeaderClick = (idx) => {
      if (this.props.onChange) this.props.onChange(idx);
    };

    parseChildren() {
      const headers = [];
      const contents = [];
      React.Children.forEach(this.props.children, (item) => {
        if (item.type === Tab) {
          headers.push(item);
          if (item.props.children) {
            contents.push(<TabContent>{item.props.children}</TabContent>);
          }
        } else if (item.type === TabContent) {
          contents.push(item);
        }
      });
      return { headers, contents };
    }

    renderHeaders(headers) {
      return headers.map((item, idx) =>
        React.cloneElement(item, {
          key: String(idx),
          active: this.props.index === idx,
          onClick: this.handleHeaderClick.bind(this, idx),
        }),
      );
    }

    renderContents(contents) {
      const activeIdx = contents.findIndex((item, idx) =>
        this.props.index === idx,
      );
      if (contents && contents[activeIdx]) {
        return React.cloneElement(contents[activeIdx], {
          key: activeIdx,
          active: true,
          tabIndex: activeIdx,
        });
      }

      return null;
    }

    render() {
      const { cls } = this.props;
      const { headers, contents } = this.parseChildren();

      const _cls = classnames('tabs', cls);

      return (
        <div className={_cls} data-cmp="tabs">
          <nav className="navigation">
            {this.renderHeaders(headers)}
          </nav>
          {this.renderContents(contents)}
        </div>
      );
    }
  }
  return Tabs;
};

const Tabs = factory(InjectTab, InjectTabContent);

export default Tabs;
