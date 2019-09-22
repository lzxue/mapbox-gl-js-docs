import React from 'react';
import md from '../md';
import {
    highlightJavascript,
    highlightJSON
} from '../prism_highlight';
import entries from 'object.entries';
import SDKSupportTable from '../sdk_support_table';
import Icon from '@mapbox/mr-ui/icon';

export default class Item extends React.Component {
    type(spec = this.props, plural = false) {
        switch (spec.type) {
            case null:
            case '*':
                return;
            case 'light':
                return (
                    <span>
                        {' '}
                        <a href="#light">light</a>
                    </span>
                );
            case 'transition':
                return (
                    <span>
                        {' '}
                        <a href="#transition">transition</a>
                    </span>
                );
            case 'sources':
                return (
                    <span>
                        {' '}
                        object with <a href="#sources">source</a> values
                    </span>
                );
            case 'layer':
                return (
                    <span>
                        {' '}
                        <a href="#layers">
                            layer
                            {plural && 's'}
                        </a>
                    </span>
                );
            case 'array':
                return (
                    <span>
                        {' '}
                        <a href="#types-array">array</a>
                        {spec.value && (
                            <span>
                                {' '}
                                of{' '}
                                {this.type(
                                    typeof spec.value === 'string'
                                        ? { type: spec.value }
                                        : spec.value,
                                    true
                                )}
                            </span>
                        )}
                    </span>
                );
            case 'filter':
                return (
                    <span>
                        {' '}
                        <a href="#expressions">
                            expression
                            {plural && 's'}
                        </a>
                    </span>
                );
            default:
                return (
                    <span>
                        {' '}
                        <a href={`#types-${spec.type}`}>
                            {spec.type}
                            {plural && 's'}
                        </a>
                    </span>
                );
        }
    }

    requires(req, i) {
        if (typeof req === 'string') {
            return (
                <span key={i}>
                    <em>Requires</em> <var>{req}</var>.{' '}
                </span>
            );
        } else if (req['!']) {
            return (
                <span key={i}>
                    <em>Disabled by</em> <var>{req['!']}</var>.{' '}
                </span>
            );
        } else {
            const [name, value] = entries(req)[0];
            if (Array.isArray(value)) {
                return (
                    <span key={i}>
                        <em>Requires</em> <var>{name}</var> to be{' '}
                        {value
                            .map((r, i) => (
                                <code key={i}>{JSON.stringify(r)}</code>
                            ))
                            .reduce((prev, curr) => [prev, ', or ', curr])}
                        .{' '}
                    </span>
                );
            } else {
                return (
                    <span key={i}>
                        <em>Requires</em> <var>{name}</var> to be{' '}
                        <code>{JSON.stringify(value)}</code>.{' '}
                    </span>
                );
            }
        }
    }

    render() {
        return (
            <div className="mb30">
                <a
                    style={{ marginTop: '-30px' }}
                    className="pt60 unprose color-blue-on-hover txt-code bg-transparent mb3 txt-l block ml-neg3"
                    href={`#${this.props.id}`}
                    id={this.props.id}
                >
                    {this.props.name}
                </a>
                <div className="mb6">
                    {this.props.kind === 'paint' && (
                        <em className="color-gray">
                            <a href="#paint-property">Paint</a> property.{' '}
                        </em>
                    )}
                    {this.props.kind === 'layout' && (
                        <em className="color-gray">
                            <a href="#layout-property">Layout</a> property.{' '}
                        </em>
                    )}

                    <em className="color-gray">
                        {this.props.required ? 'Required' : 'Optional'}
                        {this.type()}
                        {'minimum' in this.props && 'maximum' in this.props && (
                            <span>
                                {' '}
                                between <code>
                                    {this.props.minimum}
                                </code> and <code>{this.props.maximum}</code>{' '}
                                inclusive
                            </span>
                        )}
                        {'minimum' in this.props && !('maximum' in this.props) && (
                            <span>
                                {' '}
                                greater than or equal to{' '}
                                <code>{this.props.minimum}</code>
                            </span>
                        )}
                        {!('minimum' in this.props) && 'maximum' in this.props && (
                            <span>
                                {' '}
                                less than or equal to{' '}
                                <code>{this.props.minimum}</code>
                            </span>
                        )}
                        .{' '}
                    </em>

                    {this.props.values &&
                    !Array.isArray(this.props.values) && ( // skips $root.version
                            <em className="color-gray">
                                One of{' '}
                                {Object.keys(this.props.values)
                                    .map((opt, i) => (
                                        <code key={i}>
                                            {JSON.stringify(opt)}
                                        </code>
                                    ))
                                    .reduce((prev, curr) => [prev, ', ', curr])}
                                .{' '}
                            </em>
                        )}

                    {this.props.units && (
                        <em className="color-gray">
                            Units in <var>{this.props.units}</var>.{' '}
                        </em>
                    )}

                    {this.props.default !== undefined && (
                        <em className="color-gray">
                            Defaults to{' '}
                            <code>{JSON.stringify(this.props.default)}</code>.{' '}
                        </em>
                    )}

                    {this.props.requires && (
                        <em className="color-gray">
                            {this.props.requires.map((r, i) =>
                                this.requires(r, i)
                            )}{' '}
                        </em>
                    )}

                    {this.props.function === 'interpolated' && (
                        <em className="color-gray">
                            Supports{' '}
                            <a href="#expressions-interpolate">
                                <Icon name="smooth-ramp" inline={true} />
                                <code>interpolate</code>
                            </a>{' '}
                            expressions.{' '}
                        </em>
                    )}

                    {this.props.transition && (
                        <em className="color-gray">
                            <Icon name="opacity" inline={true} />
                            Transitionable.{' '}
                        </em>
                    )}
                </div>

                {this.props.doc && (
                    <div className="mb6">{md(this.props.doc)}</div>
                )}

                {this.props.values &&
                !Array.isArray(this.props.values) && ( // skips $root.version
                        <div className="mb6">
                            <dl>
                                {entries(this.props.values).map(
                                    ([v, { doc }], i) => [
                                        <dt key={`${i}-dt`}>
                                            <code>{JSON.stringify(v)}</code>:
                                        </dt>,
                                        <dd key={`${i}-dd`} className="mb12">
                                            {md(doc)}
                                        </dd>
                                    ]
                                )}
                            </dl>
                        </div>
                    )}

                {this.props.example && (
                    <div className="mb6">
                        {highlightJSON(
                            `"${this.props.name}": ${JSON.stringify(
                                this.props.example,
                                null,
                                2
                            )}`
                        )}
                    </div>
                )}

                {this.props['sdk-support'] && (
                    <div className="mb12 hmin120">
                        <SDKSupportTable {...this.props['sdk-support']} />
                    </div>
                )}
            </div>
        );
    }
}