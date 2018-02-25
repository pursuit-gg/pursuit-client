/* global window */

import React, { Component } from 'react';

import './CapturePreview.m.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class CapturePreview extends Component {
  constructor(props) {
    super(props);
    this.updatePreview = this.updatePreview.bind(this);
  }

  componentDidMount() {
    const { top, left, width, height } = this.preview.getBoundingClientRect();
    ipcRenderer.send('update-obs-display', true, width, height, left, top);
    ipcRenderer.send('create-obs-display');
    window.addEventListener('resize', this.updatePreview);
    window.addEventListener('scroll', this.updatePreview);
  }

  componentWillUnmount() {
    const { top, left, width, height } = this.preview.getBoundingClientRect();
    ipcRenderer.send('update-obs-display', false, width, height, left, top);
    ipcRenderer.send('remove-obs-display');
    window.removeEventListener('resize', this.updatePreview);
    window.removeEventListener('scroll', this.updatePreview);
  }

  updatePreview() {
    const { top, left, width, height } = this.preview.getBoundingClientRect();
    ipcRenderer.send('update-obs-display', true, width, height, left, top);
  }

  render() {
    return (
      <div styleName="wrapper" ref={(c) => { this.preview = c; }}>
        <h5> Not Tracking </h5>
      </div>
    );
  }
}

export default CapturePreview;
