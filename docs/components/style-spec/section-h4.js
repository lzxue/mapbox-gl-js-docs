import React from 'react';

export default class SectionH4 extends React.Component {
    render() {
        const { props } = this;
        return (
            <div className="px12 px12 mb24">
                <div id={`${props.id}`} />
                <h4 className="pt60" style={{ marginTop: '-30px' }}>
                    <a
                        className="unprose color-blue-on-hover"
                        href={`#${props.id}`}
                    >
                        {props.title}
                    </a>
                </h4>
                {props.children}
            </div>
        );
    }
}
