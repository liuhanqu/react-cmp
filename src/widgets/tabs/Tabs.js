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

    state = {
      pointer: {},
    };

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
    }

    componentDidUpdate(prevProps) {
      const { index, children } = this.props;
      const { index: prevIndex, children: prevChildren } = prevProps;

      if (index !== prevIndex || children !== prevChildren) {
        this.updatePointer(index);
      }
    }

    componentWillUnMount() {
      window.removeEventListener('resize', this.handleResize);
      clearTimeout(this.resizeTimeout);
    }

    handleHeaderClick = (idx) => {
      if (this.props.onChange) this.props.onChange(idx);
    };

    handleResize = () => {
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.updatePointer(this.props.index);
      }, 100);
    };

    updatePointer(idx) {
      if (this.navigationNode && this.navigationNode.children[idx]) {
        requestAnimationFrame(() => {
          const nav = this.navigationNode.getBoundingClientRect();
          const label = this.navigationNode.children[idx].getBoundingClientRect();
          const scrollLeft = this.navigationNode.scrollLeft;
          this.setState({
            pointer: {
              // top: `${nav.height}px`,
              left: `${(label.left - nav.left) + scrollLeft}px`,
              width: `${label.width}px`,
            },
          });
        });
      }
    }

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
          <nav className="navigation" ref={(node) => { this.navigationNode = node; }}>
            {this.renderHeaders(headers)}
            <span className="pointer" style={this.state.pointer} />
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
