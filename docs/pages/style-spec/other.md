---
title: Other
id: other
description: The value for any layout or paint property may be specified as a function.
contentType: specification
prependJs:
    - "import SectionH3 from '../../components/style-spec/section-h3';"
    - "import SectionH4 from '../../components/style-spec/section-h4';"
    - "import InnerSection from '../../components/style-spec/inner-section';"
    - "import SDKSupportTable from '../../components/sdk_support_table';"
    - "import ref from '../../../mapbox-gl-js/src/style-spec/reference/latest';"
    - "import Icon from '@mapbox/mr-ui/icon';"
---

{{<SectionH3 id="other-function" title="Function">}}

The value for any layout or paint property may be specified as a _function_. Functions allow you to make the appearance of a map feature change with the current zoom level and/or the feature's properties.



{{<InnerSection>}}

{{<SectionH4 id="function-stops" title="stops">}}

{{<div className="mb6 color-gray">}}
_Required (except for <var>identity</var> functions) [array](#types-array)._
{{</div>}}

Functions are defined in terms of input and output values. A set of one input value and one output value is known as a "stop." Stop output values must be literal values (i.e. not functions or expressions), and appropriate for the property. For example, stop output values for a function used in the `fill-color` property must be [colors](#types-color).

{{</SectionH4>}}



{{<SectionH4 id="function-property" title="property">}}

{{<div className="mb6 color-gray">}}
_Optional [string](#types-string)._
{{</div>}}

If specified, the function will take the specified feature property as an input. See [Zoom Functions and Property Functions](#types-function-zoom-property) for more information.

{{</SectionH4>}}



{{<SectionH4 id="function-base" title="base">}}

{{<div className="mb6 color-gray">}}
_Optional [number](#types-number). Default is {{ref.function.base.default}}._
{{</div>}}

The exponential base of the interpolation curve. It controls the rate at which the function output increases. Higher values make the output increase more towards the high end of the range. With values close to 1 the output increases linearly.

{{</SectionH4>}}



{{<SectionH4 id="function-type" title="type">}}

{{<div className="mb6 color-gray">}}
_Optional <a href="#types-string">string</a>. One of `"identity"`, `"exponential"`, `"interval"`, or `"categorical"`._
{{</div>}}

{{
<dl className="mb6">
    <dt>
        `"identity"`
    </dt>
    <dd className="mb12">
        A function that returns its input as
        the output.
    </dd>
    <dt>
        `"exponential"`
    </dt>
    <dd className="mb12">
        A function that generates an output
        by interpolating between stops just
        less than and just greater than the
        function input. The domain (input
        value) must be numeric, and the
        style property must support
        interpolation. Style properties that
        support interpolation are marked
        marked with{' '}
        <Icon
            name="smooth-ramp"
            inline={true}
        />
        , the "exponential" symbol, and{' '}
        <var>exponential</var> is the
        default function type for these
        properties.
    </dd>
    <dt>
        `"interval"`
    </dt>
    <dd className="mb12">
        A function that returns the output
        value of the stop just less than the
        function input. The domain (input
        value) must be numeric. Any style
        property may use interval functions.
        For properties marked with
        <Icon
            name="step-ramp"
            inline={true}
        />
        , the "interval" symbol, this is the
        default function type.
    </dd>
    <dt>
        `"categorical"`
    </dt>
    <dd className="mb12">
        A function that returns the output
        value of the stop equal to the
        function input.
    </dd>
</dl>
}}

{{</SectionH4>}}



{{<SectionH4 id="function-default" title="default">}}

A value to serve as a fallback function result when a value isn't otherwise available. It is used in the following circumstances:

- In categorical functions, when the feature value does not match any of the stop domain values.
- In property and zoom-and-property functions, when a feature does not contain a value for the specified property.
- In identity functions, when the feature value is not valid for the style property (for example, if the function is being used for a <var>circle-color</var> property but the feature property value is not a string or not a valid color).
- In interval or exponential property and zoom-and-property functions, when the feature value is not numeric.

If no default is provided, the style property's default is used in these circumstances.

{{</SectionH4>}}



{{<SectionH4 id="function-colorSpace" title="colorSpace">}}

{{<div className="mb6 color-gray">>}}
_Optional [string](#types-string). One of `"rgb"`, `"lab"`, `"hcl"`._
{{</div>}}

The color space in which colors interpolated. Interpolating colors in perceptual color spaces like LAB and HCL tend to produce color ramps that look more consistent and produce colors that can be differentiated more easily than those interpolated in RGB space.

{{
<dl className="mb12">
    <dt>`"rgb"`</dt>
    <dd className="mb12">
        Use the RGB color space to
        interpolate color values
    </dd>
    <dt>`"lab"`</dt>
    <dd className="mb12">
        Use the LAB color space to
        interpolate color values.
    </dd>
    <dt>`"hcl"`</dt>
    <dd className="mb12">
        Use the HCL color space to
        interpolate color values,
        interpolating the Hue, Chroma, and
        Luminance channels individually.
    </dd>
</dl>
}}

{{</SectionH4>}}

{{
<SDKSupportTable
    thing={{
        'basic functionality': {
            js: '0.10.0',
            android: '2.0.1',
            ios: '2.0.0',
            macos: '0.1.0'
        },
        '`property`': {
            js: '0.18.0',
            android: '5.0.0',
            ios: '3.5.0',
            macos: '0.4.0'
        },
        '`code`': {
            js: '0.18.0',
            android: '5.0.0',
            ios: '3.5.0',
            macos: '0.4.0'
        },
        '`exponential` type': {
            js: '0.18.0',
            android: '5.0.0',
            ios: '3.5.0',
            macos: '0.4.0'
        },
        '`interval` type': {
            js: '0.18.0',
            android: '5.0.0',
            ios: '3.5.0',
            macos: '0.4.0'
        },
        '`categorical` type': {
            js: '0.18.0',
            android: '5.0.0',
            ios: '3.5.0',
            macos: '0.4.0'
        },
        '`identity` type': {
            js: '0.26.0',
            android: '5.0.0',
            ios: '3.5.0',
            macos: '0.4.0'
        },
        '`default`': {
            js: '0.33.0',
            android: '5.0.0',
            ios: '3.5.0',
            macos: '0.4.0'
        },
        '`colorSpace`': {
            js: '0.26.0'
        }
    }}
/>
}}

**Zoom functions** allow the appearance of a map feature to change with map’s zoom level. Zoom functions can be used to create the illusion of depth and control data density. Each stop is an array with two elements: the first is a zoom level and the second is a function output value.

```json
{
    "circle-radius": {
        "stops": [
            // zoom is 5 -> circle radius will be 1px
            [5, 1],
            // zoom is 10 -> circle radius will be 2px
            [10, 2]
        ]
    }
}
```

The rendered values of [color](#types-color), [number](#types-number), and [array](#types-array) properties are interpolated between stops. [Boolean](#types-boolean) and [string](#types-string) property values cannot be interpolated, so their rendered values only change at the specified stops.

There is an important difference between the way that zoom functions render for _layout_ and _paint_ properties. Paint properties are continuously re-evaluated whenever the zoom level changes, even fractionally. The rendered value of a paint property will change, for example, as the map moves between zoom levels `4.1` and `4.6`. Layout properties, on the other hand, are evaluated only once for each integer zoom level. To continue the prior example: the rendering of a layout property will _not_ change between zoom levels `4.1` and `4.6`, no matter what stops are specified; but at zoom level `5`, the function will be re-evaluated according to the function, and the property's rendered value will change. (You can include fractional zoom levels in a layout property zoom function, and it will affect the generated values; but, still, the rendering will only change at integer zoom levels.)

**Property functions** allow the appearance of a map feature to change with its properties. Property functions can be used to visually differentate types of features within the same layer or create data visualizations. Each stop is an array with two elements, the first is a property input value and the second is a function output value. Note that support for property functions is not available across all properties and platforms at this time.

```json
{
    "circle-color": {
        "property": "temperature",
        "stops": [
            // "temperature" is 0   -> circle color will be blue
            [0, 'blue'],
            // "temperature" is 100 -> circle color will be red
            [100, 'red']
        ]
    }
}
```

{{<a id="types-function-zoom-property" className="anchor" />}}

**Zoom-and-property functions** allow the appearance of a map feature to change with both its properties _and_ zoom. Each stop is an array with two elements, the first is an object with a property input value and a zoom, and the second is a function output value. Note that support for property functions is not yet complete.

```json
{
    "circle-radius": {
        "property": "rating",
        "stops": [
            // zoom is 0 and "rating" is 0 -> circle radius will be 0px
            [{zoom: 0, value: 0}, 0],

            // zoom is 0 and "rating" is 5 -> circle radius will be 5px
            [{zoom: 0, value: 5}, 5],

            // zoom is 20 and "rating" is 0 -> circle radius will be 0px
            [{zoom: 20, value: 0}, 0],

            // zoom is 20 and "rating" is 5 -> circle radius will be 20px
            [{zoom: 20, value: 5}, 20]
        ]
    }
}
```

{{</InnerSection>}}

{{</SectionH3>}}
