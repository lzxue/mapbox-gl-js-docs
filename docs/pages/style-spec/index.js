/*---
title: 'Style Specification'
description: 'This specification defines and describes the visual appearance of a map: what data to draw, the order to draw it in, and how to style the data when drawing it.'
pathname: '/mapbox-gl-js/style-spec/'
contentType: 'Specification'
---*/

import React from 'react';
import MarkdownPageShell from '../../components/markdown-page-shell';
import Introduction from './intro.md';
import RootProperties from './root-properties.md';
import Light from './light.md';
import Sources from './sources.md';
import Sprite from './sprite.md';
import Glyphs from './glyphs.md';
import Transition from './transition.md';
import Layers from './layers.md';
import Types from './types.md';
import Expressions from './expressions.md';
import Other from './other.md';
import OtherFilter from './other-filter.md';

export default class Page extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { headings: [] };
  }

  myCallback = headings => {
    this.setState(prevState => ({
      headings: [...prevState.headings, headings]
    }));
  };
  render() {
    const headings = this.state.headings.reduce((a, b) => a.concat(b), []);
    return (
      <MarkdownPageShell {...this.props} headings={headings}>
        <div className="spec-page">
          <Introduction callbackFromParent={this.myCallback} />
          <RootProperties callbackFromParent={this.myCallback} />
          <Light callbackFromParent={this.myCallback} />
          <Sources callbackFromParent={this.myCallback} />
          <Sprite callbackFromParent={this.myCallback} />
          <Glyphs callbackFromParent={this.myCallback} />
          <Transition callbackFromParent={this.myCallback} />
          <Layers callbackFromParent={this.myCallback} />
          <Types callbackFromParent={this.myCallback} />
          <Expressions callbackFromParent={this.myCallback} />
          <Other callbackFromParent={this.myCallback} />
          <OtherFilter callbackFromParent={this.myCallback} />
        </div>
      </MarkdownPageShell>
    );
  }
}