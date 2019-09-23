---
title: Expressions
id: expressions
description: Expressions description
contentType: 'Specification'
prependJs:
    - "import SectionH3 from '../../components/style-spec/section-h3';"
    - "import SectionH4 from '../../components/style-spec/section-h4';"
    - "import InnerSection from '../../components/style-spec/inner-section';"
    - "import { groupedExpressions } from '../../data/types';"
    - "import { renderSignature } from '../../components/style-spec/render-signature';"
    - "import md from '../../components/md';"
    - "import SDKSupportTable from '../../components/sdk_support_table';"
    - "import {
        highlightJavascript,
        highlightJSON
    } from '../../components/prism_highlight';"
---

The value for any [layout property](#layout-property), [paint property](#paint-property), or [filter](#layer-filter) may be specified as an _expression_. An expression defines a formula for computing the value of the property using the _operators_ described below. The set of expression operators provided by Mapbox GL includes:

- Mathematical operators for performing arithmetic and other operations on numeric values
- Logical operators for manipulating boolean values and making conditional decisions
- String operators for manipulating strings
- Data operators, providing access to the properties of source features
- Camera operators, providing access to the parameters defining the current map view

Expressions are represented as JSON arrays. The first element of an expression array is a string naming the expression operator, e.g. [`"*"`](#expressions-*) or [`"case"`](#expressions-case). Subsequent elements (if any) are the _arguments_ to the expression. Each argument is either a literal value (a string, number, boolean, or `null`), or another expression array.

```json
[expression_name, argument_0, argument_1, ...]
```


{{<SectionH3 id="data-expressions" title="Data expressions">}}

A _data expression_ is any expression that access feature data -- that is, any expression that uses one of the data operators: [`get`](#expressions-get), [`has`](#expressions-has), [`id`](#expressions-id), [`geometry-type`](#expressions-geometry-type), [`properties`](#expressions-properties), or [`feature-state`](#expressions-feature-state). Data expressions allow a feature's properties or state to determine its appearance. They can be used to differentiate features within the same layer and to create data visualizations.

```json
{
    "circle-color": [
        "rgb",
        // red is higher when feature.properties.temperature is higher
        ["get", "temperature"],
        // green is always zero
        0,
        // blue is higher when feature.properties.temperature is lower
        ["-", 100, ["get", "temperature"]]
    ]
}
```

This example uses the [`get`](#expressions-get) operator to obtain the `temperature` value of each feature. That value is used to compute arguments to the [`rgb`](#expressions-rgb) operator, defining a color in terms of its red, green, and blue components.

Data expressions are allowed as the value of the [`filter`](#layer-filter) property, and as values for most paint and layout properties. However, some paint and layout properties do not yet support data expressions. The level of support is indicated by the "data-driven styling" row of the "SDK Support" table for each property. Data expressions with the [`feature-state`](#expressions-feature-state) operator are allowed only on paint properties.

{{</SectionH3>}}



{{<SectionH3 id="camera-expression" title="Camera expressions">}}

A _camera expression_ is any expression that uses the [`zoom`](#expressions-zoom) operator. Such expressions allow the the appearance of a layer to change with the map's zoom level. Camera expressions can be used to create the appearance of depth and to control data density.

```json
{
    "circle-radius": [
        "interpolate", ["linear"], ["zoom"],
        // zoom is 5 (or less) -> circle radius will be 1px
        5, 1,
        // zoom is 10 (or greater) -> circle radius will be 5px
        10, 5
    ]
}
```

This example uses the [`interpolate`](#expressions-interpolate) operator to define a linear relationship between zoom level and circle size using a set of input-output pairs. In this case, the expression indicates that the circle radius should be 1 pixel when the zoom level is 5 or below, and 5 pixels when the zoom is 10 or above. In between, the radius will be linearly interpolated between 1 and 5 pixels

Camera expressions are allowed anywhere an expression may be used. However, when a camera expression used as the value of a layout or paint property, it must be in one of the following forms:

```json
[ "interpolate", interpolation, ["zoom"], ... ]
```

Or:

```json
[ "step", ["zoom"], ... ]
```

Or:

```json
[
    "let",
    ... variable bindings...,
    [ "interpolate", interpolation, ["zoom"], ... ]
]
```

Or:

```json
[
    "let",
    ... variable bindings...,
    [ "step", ["zoom"], ... ]
]
```

That is, in layout or paint properties, `["zoom"]` may appear only as the input to an outer [`interpolate`](#expressions-interpolate) or [`step`](#expressions-step) expression, or such an expression within a [`let`](#expressions-let) expression.

There is an important difference between layout and paint properties in the timing of camera expression evaluation. Paint property camera expressions are re-evaluated whenever the zoom level changes, even fractionally. For example, a paint property camera expression will be re-evaluated continuously as the map moves between zoom levels 4.1 and 4.6. On the other hand, a layout property camera expression is evaluated only at integer zoom levels. It will _not_ be re-evaluated as the zoom changes from 4.1 to 4.6 -- only if it goes above 5 or below 4.

{{</SectionH3>}}



{{<SectionH3 id="composition" title="Composition">}}

A single expression may use a mix of data operators, camera operators, and other operators. Such composite expressions allows a layer's appearance to be determined by a combination of the zoom level _and_ individual feature properties.

```json
{
    "circle-radius": [
        "interpolate", ["linear"], ["zoom"],
        // when zoom is 0, set each feature's circle radius to the value of its "rating" property
        0, ["get", "rating"],
        // when zoom is 10, set each feature's circle radius to four times the value of its "rating" property
        10, ["*", 4, ["get", "rating"]]
    ]
}
```

An expression that uses both data and camera operators is considered both a data expression and a camera expression, and must adhere to the restrictions described above for both.

{{</SectionH3>}}



{{<SectionH3 id="type-system" title="Type system">}}

The input arguments to expressions, and their result values, use the same set of [types](#types) as the rest of the style specification: boolean, string, number, color, and arrays of these types. Furthermore, expressions are _type safe_: each use of an expression has a known result type and required argument types, and the SDKs verify that the result type of an expression is appropriate for the context in which it is used. For example, the result type of an expression in the [`filter`](#layer-filter) property must be [boolean](#types-boolean), and the arguments to the [`+`](#expressions-+) operator must be [numbers](#types-number).

When working with feature data, the type of a feature property value is typically not known ahead of time by the SDK. In order to preserve type safety, when evaluating a data expression, the SDK will check that the property value is appropriate for the context. For example, if you use the expression `["get", "feature-color"]` for the [`circle-color`](#paint-circle-circle-color) property, the SDK will verify that the `feature-color` value of each feature is a string identifying a valid [color](#types-color). If this check fails, an error will be indicated in an SDK-specific way (typically a log message), and the default value for the property will be used instead.

In most cases, this verification will occur automatically wherever it is needed. However, in certain situations, the SDK may be unable to automatically determine the expected result type of a data expression from surrounding context. For example, it is not clear whether the expression `["&lt;", ["get", "a"], ["get", "b"]]` is attempting to compare strings or numbers. In situations like this, you can use one of the _type assertion_ expression operators to indicate the expected type of a data expression: `["&lt;", ["number", ["get", "a"]], ["number", ["get", "b"]]]`. A type assertion checks that the feature data actually matches the expected type of the data expression. If this check fails, it produces an error and causes the whole expression to fall back to the default value for the property being defined. The assertion operators are [`array`](#expressions-types-array), [`boolean`](#expressions-types-boolean), [`number`](#expressions-types-number), and [`string`](#expressions-types-string).

Expressions perform only one kind of implicit type conversion: a data expression used in a context where a [color](#types-color) is expected will convert a string representation of a color to a color value. In all other cases, if you want to convert between types, you must use one of the _type conversion_ expression operators: [`to-boolean`](#expressions-types-to-boolean), [`to-number`](#expressions-types-to-number), [`to-string`](#expressions-types-to-string), or [`to-color`](#expressions-types-to-color). For example, if you have a feature property that stores numeric values in string format, and you want to use those values as numbers rather than strings, you can use an expression such as `["to-number", ["get", "property-name"]]`.

{{</SectionH3>}}



{{<SectionH3 id="expression-reference" title="Expression reference">}}

{{<InnerSection>}}

{{
groupedExpressions.map((group, i) => (
    <SectionH4
        key={i}
        id={`expressions-${slug(group.name)}`}
        title={group.name}
        index={i}
        length={groupedExpressions.length}
    >
        {group.name === 'Types' && (
            <div>
                <p>
                The expressions in this
                section are provided for the
                purpose of testing for and
                converting between different
                data types like strings,
                numbers, and boolean values.
                </p>
                <p>
                Often, such tests and
                conversions are unnecessary,
                but they may be necessary in
                some expressions where the
                type of a certain
                sub-expression is ambiguous.
                They can also be useful in
                cases where your feature
                data has inconsistent types;
                for example, you could use{' '}
                `to-number` to
                make sure that values like{' '}
                `"1.5"` (instead
                of `1.5`) are
                treated as numeric values.
                </p>
            </div>
        )}
        {group.name === 'Decision' && (
            <div>
                <p>
                The expressions in this section
                can be used to add conditional
                logic to your styles. For
                example, the{' '}
                <a href="#expressions-case">
                `'case'`
                </a>{' '}
                expression provides basic
                "if/then/else" logic, and{' '}
                <a href="#expressions-match">
                `'match'`
                </a>{' '}
                allows you to map specific
                values of an input expression to
                different output expressions.
                </p>
            </div>
        )}
        {group.expressions.map(({ name, doc, type, sdkSupport }, i) => (
            <div key={i}>
            <div
            className="pt60"
            style={{
                marginTop: '-30px'
            }}
            id={`expressions-${
                group.name ===
                'Types'
                    ? 'types-'
                    : ''
            }${name}`}
            />
            <span className="">
            <a
                className="txt-code bg-transparent ml-neg6 unprose color-blue-on-hover txt-l"
                href={`#expressions-${
                    group.name ===
                    'Types'
                        ? 'types-'
                        : ''
                }${name}`}
            >
                {name}
            </a>
            {doc && (
                <div>{md(doc)}</div>
            )}
            </span>
            {type.map((overload, i) => (
            <div key={i}>
                {highlightJavascript(
                    renderSignature(
                        name,
                        overload
                    )
                )}
            </div>
        ))}
        {sdkSupport && (
            <div className="mt12 mb12">
                <SDKSupportTable
                    {...sdkSupport}
                />
            </div>
        )}
    </div>
    )
    )}
    </SectionH4>
))
}}

{{</InnerSection>}}

{{</SectionH3>}}
