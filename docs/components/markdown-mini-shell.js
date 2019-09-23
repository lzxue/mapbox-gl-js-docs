import React from 'react';
import SectionH2 from './style-spec/section-h2';

export default class MarkdownMiniShell extends React.Component {
  componentDidMount() {
    this.props.callbackFromParent(this.props.frontMatter.headings);
  }
  render() {
    const { props } = this;
    return (
      <React.Fragment>
        <SectionH2
          location={props.location}
          id={props.frontMatter.id}
          title={props.frontMatter.title}
        >
          {props.children}
        </SectionH2>
      </React.Fragment>
    );
  }
}
