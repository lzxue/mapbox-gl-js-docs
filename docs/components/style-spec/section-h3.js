import React from 'react';

export default class SectionH3 extends React.Component {
    render() {
        const { props } = this;
        return (
            <div id={props.id} className="style-spec-section-h3">
                <h3 className="pt60" style={{ marginTop: '-30px' }}>
                    <a
                        className="unprose color-blue-on-hover"
                        href={`#${props.id}`}
                        title={`link to ${props.title}`}
                    >
                        {props.title}
                    </a>
                </h3>
                {props.children}
            </div>
        );
    }
}