import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import InjectButton from '../button';
import InjectOverlay from '../overlay';
import Portal from '../hoc/Portal';
import ActivableRenderer from '../hoc/ActivableRenderer';
import './style.css';

const factory = (Overlay, Button) => {
  class Dialog extends Component {
    static propTypes = {
      actions: PropTypes.array,
      active: PropTypes.bool,
      children: PropTypes.node,
      cls: PropTypes.string,
      onEscKeyDown: PropTypes.func,
      onOverlayClick: PropTypes.func,
      title: PropTypes.string,
    };

    static defaultProps = {
      actions: [],
      active: false,
    };

    render() {
      const { cls, active, title, children, actions: btnActions, onEscKeyDown, onOverlayClick } = this.props;

      const actions = btnActions.map((action, idx) => {
        const _cls = classnames({ [action.cls]: action.cls });
        return <Button key={String(idx)} className={_cls} {...action} />;
      });

      const _cls = classnames('dialog', {
        active,
      }, cls);

      return (
        <Portal className="wrapper">
          <Overlay
            active={active}
            onClick={onOverlayClick}
            onEscKeyDown={onEscKeyDown}
          />
          <div className={_cls} data-cmp="dialog">
            <section className="body">
              {title ? <h6 className="title">{title}</h6> : null}
              {children}
            </section>
            {actions.length
              ? <nav className="navigation">
                {actions}
              </nav>
              : null
           }
          </div>
        </Portal>
      );
    }
  }

  return ActivableRenderer()(Dialog);
};


const Dialog = factory(InjectOverlay, InjectButton);

export default Dialog;
