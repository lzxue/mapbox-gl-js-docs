import React from 'react';

export default class InnerSection extends React.Component {
    render() {
        const { props } = this;
        return (
            <div
                className={`px24 py18 border border--gray-light round style-spec-inner-section ${props.className ||
                    props.className}`}
            >
                {this.props.children}
            </div>
        );
    }
}