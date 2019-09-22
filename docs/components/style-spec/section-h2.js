import React from 'react';
import Feedback from '@mapbox/dr-ui/feedback';
import constants from '../../constants';

export default class SectionH2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: undefined
        };
    }

    componentDidMount() {
        MapboxPageShell.afterUserCheck(() => {
            this.setState({
                userName: MapboxPageShell.getUser()
                    ? MapboxPageShell.getUser().id
                    : undefined
            });
        });
    }
    render() {
        const { props } = this;
        return (
            <div className="style-spec-section-h2">
                <a id={props.id} className="anchor" />
                <h2>
                    <a
                        className="unprose"
                        href={`#${props.id}`}
                        title={`link to ${props.title}`}
                    >
                        {props.title}
                    </a>
                </h2>
                {this.props.children}
                <div className="mt18">
                    <Feedback
                        site="Style Specification"
                        section={props.title}
                        type={`section on ${props.title}`}
                        location={this.props.location}
                        userName={this.state.userName}
                        webhook={constants.FORWARD_EVENT_WEBHOOK}
                    />
                </div>
            </div>
        );
    }
}