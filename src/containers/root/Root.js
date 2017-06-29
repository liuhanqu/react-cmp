import React, { Component } from 'react';

import { TooltipButton } from 'widgets/button';

import 'styles/reset';

class Root extends Component {
  state = {
    active: false,
  };
  render() {
    return (
      <div>
        <div>react cmps which had been used in project.</div>
        <TooltipButton
          tooltip="abcd"
          tooltipPosition="bottom"
          label="aaadddddd"
          style={{ margin: '150px' }}
          onClick={() => {
            console.log('click');
          }}
        />
      </div>
    );
  }
}

export default Root;
