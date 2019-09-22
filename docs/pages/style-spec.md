---
title: 'Style Specification'
description: 'This specification defines and describes the visual appearance of a map: what data to draw, the order to draw it in, and how to style the data when drawing it.'
pathname: '/mapbox-gl-js/style-spec-md/'
contentType: 'Specification'
prependJs:
    - "import 'core-js/stable';"
    - "import 'regenerator-runtime/runtime';"
    - "import slug from 'slugg';"
    - "import assert from 'assert';"
    - "import SectionH2 from '../components/style-spec/section-h2';"
    - "import SectionH3 from '../components/style-spec/section-h3';"
    - "import SectionH4 from '../components/style-spec/section-h4';"
    - "import InnerSection from '../components/style-spec/inner-section';"
    - "import Item from '../components/style-spec/item';"
    - "import { sourceTypes, layerTypes, groupedExpressions } from '../data/types';"
    - "import { renderSignature } from '../components/style-spec/render-signature';"
    - "import md from '../components/md';"
    - "import PageShell from '../components/page_shell';"
    - "import SDKSupportTable from '../components/sdk_support_table';"
    - "import {
        highlightJavascript,
        highlightJSON
    } from '../components/prism_highlight';"
    - "import entries from 'object.entries';"
    - "import ref from '../../mapbox-gl-js/src/style-spec/reference/latest';"
    - "import Icon from '@mapbox/mr-ui/icon';"
    - "import Feedback from '@mapbox/dr-ui/feedback';"
    - "import constants from '../constants';"
---

{{<h1 className="txt-fancy">Style Specification</h1>}}

A Mapbox style is a document that defines the visual appearance of a map: what data to draw, the order to draw it in, and how to style the data when drawing it. A style document is a <a href="http://www.json.org/">JSON</a> object with specific root level and nested properties. This specification defines and describes these properties.

The intended audience of this specification includes:

- Advanced designers and cartographers who want to write styles by hand rather than use <a href="https://www.mapbox.com/studio"> Mapbox Studio</a>
- Developers using style-related features of{' '} <a href="https://docs.mapbox.com/mapbox-gl-js/">Mapbox GL JS</a> or the <a href="https://docs.mapbox.com/android/">Mapbox Maps SDK for Android</a>
- Authors of software that generates or processes Mapbox styles.


For platform-appropriate documentation of style-related features, developers using the Mapbox Maps SDK for iOS should consult the <a href="https://docs.mapbox.com/ios/maps/overview/">iOS SDK API reference</a>, and developers using the Mapbox Maps SDK for macOS should consult the 
<a href="https://mapbox.github.io/mapbox-gl-native/macos/">macOS SDK API reference</a>.

<!-- ROOT PROPERTIES -->

{{
<SectionH2
    location={this.props.location}
    id="root"
    title="Root Properties"
>
}}

Root level properties of a Mapbox style specify the map's layers, tile sources and other resources, and default values for the initial camera position when not specified elsewhere.

```json
{
    "version":${ref.$version},
    "name": "Mapbox Streets",
    "sprite": "mapbox://sprites/mapbox/streets-v${ref.$version}",
    "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    "sources": {...},
    "layers": [...]
}
```

{{
    <InnerSection>
        {entries(ref.$root).map(([name, prop], i) => (
            <Item
                key={i}
                id={`root-${name}`}
                name={name}
                {...prop}
            />
        ))}
    </InnerSection>
}}

{{</SectionH2>}}

<!-- LIGHT -->

{{
<SectionH2
    location={this.props.location}
    id="light"
    title="Light"
>
}}

A style's <code>light</code> property provides global light source for that style.

```json
"light": {{JSON.stringify(
    ref.$root.light.example,
    null,
    2
)}}
```

{{
<InnerSection>
    {entries(ref.light).map(([name, prop], i) => (
        <Item
            key={i}
            id={`light-${name}`}
            name={name}
            {...prop}
        />
    ))}
</InnerSection>
}}

{{</SectionH2>}}


<!-- SOURCES -->

{{
<SectionH2
    location={this.props.location}
    id="sources"
    title="Sources"
>
}}

Sources supply data to be shown on the map. The type of source is specified by the <code>"type"</code> property, and must be one of 

{{sourceTypes.map((t, i) => {
    return <var key={i}>{t}</var>;
}).reduce((prev, curr) => {
    return [prev, ', ', curr]
})}}

. Adding a source won't immediately make data appear on the map because sources don't contain styling details like color or width. Layers refer to a source and give it a visual representation. This makes it possible to style the same source in different ways, like differentiating between types of roads in a highways layer.

Tiled sources (vector and raster) must specify their details in terms of the <a href="https://github.com/mapbox/tilejson-spec">TileJSON specification</a>. This can be done in several ways:

- By supplying TileJSON properties such as <code>"tiles"</code>, <code>"minzoom"</code>, and <code>"maxzoom"</code> directly in the source:

```json
"mapbox-streets": {
    "type": "vector",
    "tiles": [
        "http://a.example.com/tiles/{z}/{x}/{y}.pbf",
        "http://b.example.com/tiles/{z}/{x}/{y}.pbf"
    ],
    "maxzoom": 14
}
```

- By providing a <code>"url"</code> to a TileJSON resource:

```json
"mapbox-streets": {
    "type": "vector",
    "url": "http://api.example.com/tilejson.json"
}
```

- By providing a url to a WMS server that supports EPSG:3857 (or EPSG:900913) as a source of tiled data. The server url should contain a<code>"{`{bbox-epsg-3857}`}"</code> replacement token to supply the <code>bbox</code> parameter.

```json
"wms-imagery": {
    "type": "raster",
    "tiles": [
        "http://a.example.com/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=example"
    ],
    "tileSize": 256
}
```

{{<InnerSection>}}

{{<SectionH3 id="sources-vector" title="vector">}}

A vector tile source. Tiles must be in <a href="https://www.mapbox.com/developers/vector-tiles/">Mapbox Vector Tile format</a>. All geometric coordinates in vector tiles must be between <code>-1 * extent</code> and <code>(extent * 2) - 1</code> inclusive. All layers that use a vector source must specify a <a href="#layer-source-layer"><code>"source-layer"</code></a> value. For vector tiles hosted by Mapbox, the <code>"url"</code> value should be of the form  <code>mapbox://<var>mapid</var></code>.

```json
"mapbox-streets": {
    "type": "vector",
    "url": "mapbox://mapbox.mapbox-streets-v6"
}
```

{{entries(ref.source_vector).map(
    ([name, prop], i) =>
        name !== '*' &&
        name !== 'type' && (
            <Item
                key={i}
                id={`sources-vector-${name}`}
                name={name}
                {...prop}
            />
        )
)}}

{{
<SDKSupportTable
    thing={{
        "basic functionality": {
            js: '0.10.0',
            android: '2.0.1',
            ios: '2.0.0',
            macos: '0.1.0'
        }
    }}
/>
}}

{{</SectionH3>}}

{{<SectionH3 id="sources-raster" title="raster">}}

A raster tile source. For raster tiles hosted by Mapbox, the <code>"url"</code> value should be of the form <code>mapbox://<var>mapid</var></code>.

```json
"mapbox-satellite": {
    "type": "raster",
    "url": "mapbox://mapbox.satellite",
    "tileSize": 256
}
```

{{entries(ref.source_raster).map(
    ([name, prop], i) =>
        name !== '*' &&
        name !== 'type' && (
            <Item
                key={i}
                id={`sources-raster-${name}`}
                name={name}
                {...prop}
            />
        )
)}}
    
{{
<SDKSupportTable
    thing={{
        'basic functionality': {
            js: '0.10.0',
            android: '2.0.1',
            ios: '2.0.0',
            macos: '0.1.0'
        }
    }}
/>
}}

{{</SectionH3>}}

{{<SectionH3 id="sources-raster-dem" title="raster-dem">}}

A raster DEM source. Currently only supports <a href="https://blog.mapbox.com/global-elevation-data-6689f1d0ba65">Mapbox Terrain RGB</a> (<code>mapbox://mapbox.terrain-rgb</code>):

```json
"mapbox-terrain-rgb": {
    "type": "raster-dem",
    "url": "mapbox://mapbox.terrain-rgb"
}
```

{{entries(ref.source_raster_dem).map(
    ([name, prop], i) =>
        name !== '*' &&
        name !== 'type' && (
            <Item
                key={i}
                id={`sources-raster-dem-${name}`}
                name={name}
                {...prop}
            />
        )
)}}

{{
<SDKSupportTable
    thing={{
        'basic functionality': {
            js: '0.43.0'
        }
    }}
/>
}}

{{</SectionH3>}}

{{<SectionH3 id="sources-geojson" title="geojson">}}

A <a href="http://geojson.org/">GeoJSON</a> source. Data must be provided via a <code>"data"</code> property, whose value can be a URL or inline GeoJSON.

```json
"geojson-marker": {
    "type": "geojson",
    "data": {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-77.0323, 38.9131]
        },
        "properties": {
            "title": "Mapbox DC",
            "marker-symbol": "monument"
        }
    }
}
```

This example of a GeoJSON source refers to an external GeoJSON document via its URL. The GeoJSON document must be on the same domain or accessible using <a href="http://enable-cors.org/">CORS</a>.

```json
"geojson-lines": {
    "type": "geojson",
    "data": "./lines.geojson"
}
```

{{entries(ref.source_geojson).map(
    ([name, prop], i) =>
        name !== '*' &&
        name !== 'type' && (
            <Item
                key={i}
                id={`sources-geojson-${name}`}
                name={name}
                {...prop}
            />
        )
)}}

{{
<SDKSupportTable
    thing={{
        'basic functionality': {
            js: '0.10.0',
            android: '2.0.1',
            ios: '2.0.0',
            macos: '0.1.0'
        },
        clustering: {
            js: '0.14.0',
            android: '4.2.0',
            ios: '3.4.0',
            macos: '0.3.0'
        },
        'line distance metrics': {
            js: '0.45.0',
            android: '6.5.0',
            ios: '4.4.0',
            macos: '0.11.0'
        }
    }}
/>
}}

{{</SectionH3>}}

{{<SectionH3 id="sources-image" title="image">}}

An image source. The <code>"url"</code> value contains the image location.

The <code>"coordinates"</code> array contains <code>[longitude, latitude]</code> pairs for the image corners listed in clockwise order: top left, top right, bottom right, bottom left.

```json
"image": {
    "type": "image",
    "url": "https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif",
    "coordinates": [
        [-80.425, 46.437],
        [-71.516, 46.437],
        [-71.516, 37.936],
        [-80.425, 37.936]
    ]
}
```

{{entries(ref.source_image).map(
    ([name, prop], i) =>
        name !== '*' &&
        name !== 'type' && (
            <Item
                key={i}
                id={`sources-image-${name}`}
                name={name}
                {...prop}
            />
        )
)}}

{{
<SDKSupportTable
    thing={{
        'basic functionality': {
            js: '0.10.0',
            android: '5.2.0',
            ios: '3.7.0',
            macos: '0.6.0'
        }
    }}
/>
}}

{{</SectionH3>}}

{{<SectionH3 id="sources-video" title="video">}}

A video source. The <code>"urls"</code> value is an array. For each URL in the array, a video element <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source">source</a> will be created, in order to support same media in multiple formats supported by different browsers.

The <code>"coordinates"</code> array contains <code>[longitude, latitude]</code> pairs for the video corners listed in clockwise order: top left, top right, bottom right, bottom left.

```json
"video": {
    "type": "video",
    "urls": [
        "https://static-assets.mapbox.com/mapbox-gl-js/drone.mp4",
        "https://static-assets.mapbox.com/mapbox-gl-js/drone.webm"
    ],
    "coordinates": [
        [-122.51596391201019, 37.56238816766053],
        [-122.51467645168304, 37.56410183312965],
        [-122.51309394836426, 37.563391708549425],
        [-122.51423120498657, 37.56161849366671]
    ]
}
```

{{entries(ref.source_video).map(
    ([name, prop], i) =>
        name !== '*' &&
        name !== 'type' && (
            <Item
                key={i}
                id={`sources-video-${name}`}
                name={name}
                {...prop}
            />
        )
)}}

{{
<SDKSupportTable
    thing={{
        'basic functionality': {
            js: '0.10.0'
        }
    }}
/>
}}

{{</SectionH3>}}

{{</InnerSection>}}

{{</SectionH2>}}

<!-- SPRITE -->

{{
<SectionH2
    location={this.props.location}
    id="sprite"
    title="Sprite"
>
}}

A style's <code>sprite</code> property supplies a URL template for loading small images to use in rendering <code>background-pattern</code>, <code>fill-pattern</code>, <code>line-pattern</code>,<code>fill-extrusion-pattern</code> and <code>icon-image</code> style properties.

```json
"sprite": {{JSON.stringify(
    ref.$root.sprite.example,
    null,
    2
)}}
```

A valid sprite source must supply two types of files:

- An <em>index file</em>, which is a JSON document containing a description of each image contained in the sprite. The content of this file must be a JSON object whose keys form identifiers to be used as the values of the above style properties, and whose values are objects describing the dimensions (<code>width</code> and <code>height</code> properties) and pixel ratio (<code>pixelRatio</code>) of the image and its location within the sprite (<code>x</code> and{' '} <code>y</code>). For example, a sprite containing a single image might have the following index file contents:

```json
{
    "poi": {
        "width": 32,
        "height": 32,
        "x": 0,
        "y": 0,
        "pixelRatio": 1
    }
}
```

- Then the style could refer to this sprite image by creating a symbol layer with the layout property <code>"icon-image": "poi"</code>, or with the tokenized value  <code>"icon-image": "{`{icon}`}"</code> and vector tile features with a <code>icon</code> property with the value <code>poi</code>.
- <em>Image files</em>, which are PNG images containing the sprite data.

Mapbox SDKs will use the value of the <code>sprite</code> property in the style to generate the URLs for loading both files. First, for both file types, it will append <code>@2x</code> to the URL on high-DPI devices. Second, it will append a file extension: <code>.json</code> for the index file, and <code>.png</code> for the image file. For example, if you specified <code>"sprite": "https://example.com/sprite"</code>, renderers would load <code>https://example.com/sprite.json</code> and <code>https://example.com/sprite.png</code>, or <code>https://example.com/sprite@2x.json</code> and <code>https://example.com/sprite@2x.png</code>.

If you are using Mapbox Studio, you will use prebuilt sprites provided by Mapbox, or you can upload custom SVG images to build your own sprite. In either case, the sprite will be built automatically and supplied by Mapbox APIs. If you want to build a sprite by hand and self-host the files, you can use <a href="https://github.com/mapbox/spritezero-cli">spritezero-cli</a>, a command line utility that builds Mapbox GL compatible sprite PNGs and index files from a directory of SVGs.

{{</SectionH2>}}

{{
<SectionH2
    location={this.props.location}
    id="glyphs"
    title="Glyphs"
>
}}

A style's <code>glyphs</code> property provides a URL template for loading signed-distance-field glyph sets in PBF format.

```json
"glyphs": {{JSON.stringify(
    ref.$root.glyphs.example,
    null,
    2
)}}
```

This URL template should include two tokens:

- <code>{`{fontstack}`}</code> When requesting glyphs, this token is replaced with a comma separated list of fonts from a font stack specified in the <a href="#layout-symbol-text-font"><code>text-font</code></a> property of a symbol layer.
- <code>{`{range}`}</code> When requesting glyphs, this token is replaced with a range of 256 Unicode code points. For example, to load glyphs for the <a href="https://en.wikipedia.org/wiki/Unicode_block">Unicode Basic Latin and Basic Latin-1 Supplement blocks</a>, the range would be <code>0-255</code>. The actual ranges that are loaded are determined at runtime based on what text needs to be displayed.

{{</SectionH2>}}

{{
<SectionH2
    location={this.props.location}
    id="transition"
    title="Transition"
>
}}

A <code>transition</code> property controls timing for the interpolation between a transitionable style property's previous value and new value. A style's <a href="#root-transition" title="link to root-transition">root <code>transition</code></a> property provides global transition defaults for that style. Any transitionable style property may also have its own <code>-transition</code> property that defines specific transition timing for that specific layer property, overriding the global <code>transition</code> values.

```json
"transition": {{JSON.stringify(
    ref.$root.transition.example,
    null,
    2
)}}
```

{{
<InnerSection>
    {entries(ref.transition).map(([name, prop], i) => (
    <Item
        key={i}
        id={`transition-${name}`}
        name={name}
        {...prop}
    />
    ))}
</InnerSection>
}}

{{</SectionH2>}}

{{
<SectionH2
    location={this.props.location}
    id="layers"
    title="Layers"
>
}}

A style's <code>layers</code> property lists all of the layers available in that style. The type of layer is specified by the <code>"type"</code> property, and must be one of {{layerTypes.map((t, i) => <var key={i}>{t}</var>).reduce((prev, curr) => [prev, ', ', curr])}}.

Except for layers of the <var>background</var> type, each layer needs to refer to a source. Layers take the data that they get from a source, optionally filter features, and then define how those features are styled.

```json
"layers": {{JSON.stringify(
    ref.$root.layers.example,
    null,
    2
    )}}
```

{{<InnerSection className="mb24">
    {entries(ref.layer).map(([name, prop], i) => (
        <Item
            key={i}
            id={`layer-${name}`}
            name={name}
            {...prop}
        />
    ))}
</InnerSection>}}

Layers have two sub-properties that determine how data from that layer is rendered: <code>layout</code> and <code>paint</code> properties.

<em id="layout-property">Layout properties</em> appear in the layer's <code>"layout"</code> object. They are applied early in the rendering process and define how data for that layer is passed to the GPU. Changes to a layout property require an asynchronous "layout" step.

<em id="paint-property">Paint properties</em> are applied later in the rendering process. Paint properties appear in the layer's <code>"paint"</code> object. Changes to a paint property are cheap and happen synchronously.

{{
<InnerSection className="mt24">
    {layerTypes.map((type, i) => (
        <SectionH3
        key={i}
        id={`layers-${type}`}
        title={type}
        >
        {entries(ref[`layout_${type}`]).map(
            ([name, prop], i) => (
                <Item
                    key={i}
                    id={`layout-${type}-${name}`}
                    name={name}
                    kind="layout"
                    {...prop}
                />
            )
        )}
        {entries(ref[`paint_${type}`]).map(
            ([name, prop], i) => (
                <Item
                    key={i}
                    id={`paint-${type}-${name}`}
                    name={name}
                    kind="paint"
                    {...prop}
                />
            )
        )}
        </SectionH3>
    ))}
</InnerSection>
}}

{{</SectionH2>}}

{{
<SectionH2
    location={this.props.location}
    id="types"
    title="Types"
>
}}

A Mapbox style contains values of various types, most commonly as values for the style properties of a layer.

{{<SectionH3 id="types-color" title="Color">}}

The <code>color</code> type represents a color in the <a href="https://en.wikipedia.org/wiki/SRGB">sRGB color space</a>. Colors are written as JSON strings in a variety of permitted formats: HTML-style hex values, rgb, rgba, hsl, and hsla. Predefined HTML colors names, like <code>yellow</code> and <code>blue</code>, are also permitted.

```json
{
    "line-color": "#ff0",
    "line-color": "#ffff00",
    "line-color": "rgb(255, 255, 0)",
    "line-color": "rgba(255, 255, 0, 1)",
    "line-color": "hsl(100, 50%, 50%)",
    "line-color": "hsla(100, 50%, 50%, 1)",
    "line-color": "yellow"
}
```

Especially of note is the support for hsl, which
can be <a href="http://mothereffinghsl.com/">easier to reason about than rgb()</a>.

{{</SectionH3>}}

{{<SectionH3 id="types-formatted" title="Formatted">}}

The <code>formatted</code> type represents a string broken into sections annotated with separate formatting options.

```json
{
    "text-field": ["format",
        "foo", { "font-scale": 1.2 },
        "bar", { "font-scale": 0.8 }
    ]
}
```

{{</SectionH3>}}

{{<SectionH3 id="types-string" title="String">}}

A string is basically just text. In Mapbox styles, you're going to put it in quotes.

```json
{
    "icon-image": "marker"
}
```

{{</SectionH3>}}

{{<SectionH3 id="types-boolean" title="Boolean">}}

Boolean means yes or no, so it accepts the values <code>true</code> or <code>false</code>.

```json
{
    "fill-enabled": true
}
```

{{</SectionH3>}}

{{<SectionH3 id="types-number" title="Number">}}

A number value, often an integer or floating point (decimal number). Written without quotes.

```json
{
    "text-size": 24
}
```

{{</SectionH3>}}

{{<SectionH3 id="types-array" title="Array">}}

Arrays are comma-separated lists of one or more numbers in a specific order. For example, they're used in line dash arrays, in which the numbers specify intervals of line, break, and
line again.

```json
{
    "line-dasharray": [2, 4]
}
```

{{</SectionH3>}}

{{</SectionH2>}}

<!-- EXPRESSIONS -->

{{
<SectionH2
    location={this.props.location}
    id="expressions"
    title="Expressions"
>
}}

The value for any <a href="#layout-property">layout property</a>, <a href="#paint-property">paint property</a>, or <a href="#layer-filter">filter</a> may be specified as an <em>expression</em>. An expression defines a formula for computing the value of the property using the <em>operators</em> described below. The set of expression operators provided by Mapbox GL includes:

- Mathematical operators for performing arithmetic and other operations on numeric values
- Logical operators for manipulating boolean values and making conditional decisions
- String operators for manipulating strings
- Data operators, providing access to the properties of source features
- Camera operators, providing access to the parameters defining the current map view

Expressions are represented as JSON arrays. The first element of an expression array is a string naming the expression operator, e.g. <a href="#expressions-*"><code>"*"</code></a>
or <a href="#expressions-case"><code>"case"</code></a>. Subsequent elements (if any) are the <em>arguments</em> to the expression. Each argument is either a literal value (a string, number, boolean, or <code>null</code>), or another expression array.

```json
[expression_name, argument_0, argument_1, ...]
```

{{
<SectionH3
    id="data-expressions"
    title="Data expressions"
>
}}

A <em>data expression</em> is any expression that access feature data -- that is, any expression that uses one of the data operators: <a href="#expressions-get"><code>get</code></a>, <a href="#expressions-has"><code>has</code></a>, <a href="#expressions-id"><code>id</code></a>, <a href="#expressions-geometry-type"><code>geometry-type</code></a>, <a href="#expressions-properties"><code>properties</code></a>, or <a href="#expressions-feature-state"><code>feature-state</code></a>. Data expressions allow a feature's properties or state to determine its appearance. They can be used to differentiate features within the same layer and to create data visualizations.

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

This example uses the <a href="#expressions-get"><code>get</code></a> operator to obtain the <code>temperature</code> value of each feature. That value is used to compute arguments to the <a href="#expressions-rgb"><code>rgb</code></a> operator, defining a color in terms of its red, green, and blue components.

Data expressions are allowed as the value of the <a href="#layer-filter"><code>filter</code></a> property, and as values for most paint and layout properties. However, some paint and layout properties do not yet support data expressions. The level of support is indicated by the "data-driven styling" row of the "SDK Support" table for each property. Data expressions with the <a href="#expressions-feature-state"><code>feature-state</code></a> operator are allowed only on paint properties.

{{</SectionH3>}}

{{
<SectionH3
    id="camera-expression"
    title="Camera expressions"
>
}}

A <em>camera expression</em> is any expression that uses the <a href="#expressions-zoom"><code>zoom</code></a> operator. Such expressions allow the the appearance of a layer to change with the map's zoom level. Camera expressions can be used to create the appearance of depth and to control data density.

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

This example uses the <a href="#expressions-interpolate"><code>interpolate</code></a> operator to define a linear relationship between zoom level and circle size using a set of input-output pairs. In this case, the expression indicates that the circle radius should be 1 pixel when the zoom level is 5 or below, and 5 pixels when the zoom is 10 or above. In between, the radius will be linearly interpolated between 1 and 5 pixels

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

That is, in layout or paint properties, <code>["zoom"]</code> may appear only as the input to an outer <a href="#expressions-interpolate"><code>interpolate</code></a> or <a href="#expressions-step"><code>step</code></a> expression, or such an expression within a <a href="#expressions-let"><code>let</code></a> expression.

There is an important difference between layout and paint properties in the timing of camera expression evaluation. Paint property camera expressions are re-evaluated whenever the zoom level changes, even fractionally. For example, a paint property camera expression will be re-evaluated continuously as the map moves between zoom levels 4.1 and 4.6. On the other hand, a layout property camera expression is evaluated only at integer zoom levels. It will <em>not</em> be re-evaluated as the zoom changes from 4.1 to 4.6 -- only if it goes above 5 or below 4.

{{</SectionH3>}}

{{<SectionH3 id="composition" title="Composition">}}

A single expression may use a mix of data operators, camera operators, and other operators. Such composite expressions allows a layer's appearance to be determined by a combination of the zoom level <em>and</em> individual feature properties.

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

The input arguments to expressions, and their result values, use the same set of <a href="#types">types</a> as the rest of the style specification: boolean, string, number, color, and arrays of these types. Furthermore, expressions are <em>type safe</em>: each use of an expression has a known result type and required argument types, and the SDKs verify that the result type of an expression is appropriate for the context in which it is used. For example, the result type of an expression in the <a href="#layer-filter"><code>filter</code></a> property must be <a href="#types-boolean">boolean</a>, and the arguments to the <a href="#expressions-+"><code>+</code></a> operator must be <a href="#types-number">numbers</a>.

When working with feature data, the type of a feature property value is typically not known ahead of time by the SDK. In order to preserve type safety, when evaluating a data expression, the SDK will check that the property value is appropriate for the context. For example, if you use the expression <code>["get", "feature-color"]</code> for the <a href="#paint-circle-circle-color"><code>circle-color</code></a> property, the SDK will verify that the <code>feature-color</code> value of each feature is a string identifying a valid <a href="#types-color">color</a>. If this check fails, an error will be indicated in an SDK-specific way (typically a log message), and the default value for the property will be used instead.

In most cases, this verification will occur automatically wherever it is needed. However, in certain situations, the SDK may be unable to automatically determine the expected result type of a data expression from surrounding context. For example, it is not clear whether the expression <code>["&lt;", ["get", "a"], ["get", "b"]]</code> is attempting to compare strings or numbers. In situations like this, you can use one of the <em>type assertion</em> expression operators to indicate the expected type of a data expression: <code>["&lt;", ["number", ["get", "a"]], ["number", ["get", "b"]]]</code>. A type assertion checks that the feature data actually matches the expected type of the data expression. If this check fails, it produces an error and causes the whole expression to fall back to the default value for the property being defined. The assertion operators are <a href="#expressions-types-array"><code>array</code></a>, <a href="#expressions-types-boolean"><code>boolean</code></a>, <a href="#expressions-types-number"><code>number</code></a>, and <a href="#expressions-types-string"><code>string</code></a>.

Expressions perform only one kind of implicit type conversion: a data expression used in a context where a <a href="#types-color">color</a> is expected will convert a string representation of a color to a color value. In all other cases, if you want to convert between types, you must use one of the <em>type conversion</em> expression operators: <a href="#expressions-types-to-boolean"><code>to-boolean</code></a>, <a href="#expressions-types-to-number"><code>to-number</code></a>, <a href="#expressions-types-to-string"><code>to-string</code></a>, or <a href="#expressions-types-to-color"><code>to-color</code></a>. For example, if you have a feature property that stores numeric values in string format, and you want to use those values as numbers rather than strings, you can use an expression such as <code>["to-number", ["get", "property-name"]]</code>.

{{</SectionH3>}}

{{
<SectionH3
    id="expression-reference"
    title="Expression reference"
>
}}

{{<InnerSection>
    {groupedExpressions.map((group, i) => (
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
                <code>to-number</code> to
                make sure that values like{' '}
                <code>"1.5"</code> (instead
                of <code>1.5</code>) are
                treated as numeric values.
                </p>
                </div>
            )}
            {group.name === 'Decision' && (
                <p>
                The expressions in this section
                can be used to add conditional
                logic to your styles. For
                example, the{' '}
                <a href="#expressions-case">
                <code>'case'</code>
                </a>{' '}
                expression provides basic
                "if/then/else" logic, and{' '}
                <a href="#expressions-match">
                <code>'match'</code>
                </a>{' '}
                allows you to map specific
                values of an input expression to
                different output expressions.
                </p>
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
))}
</InnerSection>
</SectionH3>
</SectionH2>}}

{{
<SectionH2
    location={this.props.location}
    id="other"
    title="Other"
>
}}

{{<SectionH3 id="other-function" title="Function">}}

The value for any layout or paint property may be specified as a <em>function</em>. Functions allow you to make the appearance of a map feature change with the current zoom level and/or the feature's properties.

{{<InnerSection>}}

{{
<SectionH4 id="function-stops" title="stops">
<div>
    <em className="quiet">
        Required (except for{' '}
        <var>identity</var> functions){' '}
        <a href="#types-array">array</a>.
    </em>
</div>
}}

Functions are defined in terms of input and output values. A set of one input value and one output value is known as a "stop." Stop output values must be literal values (i.e. not functions or expressions), and appropriate for the property. For example, stop output values for a function used in the <code>fill-color</code> property must be <a href="#types-color">colors</a>.

{{</SectionH4>}}

{{
<SectionH4 id="function-property" title="property">
<div>
    <em className="color-gray">
        Optional{' '}
        <a href="#types-string">string</a>.
    </em>
</div>
}}

If specified, the function will take the specified feature property as an input. See <a href="#types-function-zoom-property">Zoom Functions and Property Functions</a> for more information.

{{</SectionH4>}}

{{
<SectionH4 id="function-base" title="base">
<div>
    <em className="color-gray">
        Optional{' '}
        <a href="#types-number">number</a>.
        Default is{' '}
        {ref.function.base.default}.
    </em>
</div>
}}

The exponential base of the interpolation curve. It controls the rate at which the function output increases. Higher values make the output increase more towards the high end of the range. With values close to 1 the output increases linearly.

{{</SectionH4>}}

{{
<SectionH4 id="function-type" title="type">
<div className="mb6">
    <em className="color-gray">
        Optional{' '}
        <a href="#types-string">string</a>.
        One of <code>"identity"</code>,{' '}
        <code>"exponential"</code>,
        <code>"interval"</code>, or{' '}
        <code>"categorical"</code>.
    </em>
</div>
}}

{{
<dl className="mb6">
<dt>
    <code>"identity"</code>
</dt>
<dd className="mb12">
    A function that returns its input as
    the output.
</dd>
<dt>
    <code>"exponential"</code>
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
    <code>"interval"</code>
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
    <code>"categorical"</code>
</dt>
<dd className="mb12">
    A function that returns the output
    value of the stop equal to the
    function input.
</dd>
</dl>
}}

{{</SectionH4>}}

{{
<SectionH4
    id="function-default"
    title="default"
>
}}

A value to serve as a fallback function result when a value isn't otherwise available. It is used in the following circumstances:

- In categorical functions, when the feature value does not match any of the stop domain values.
- In property and zoom-and-property functions, when a feature does not contain a value for the specified property.
- In identity functions, when the feature value is not valid for the style property (for example, if the function is being used for a <var>circle-color</var> property but the feature property value is not a string or not a valid color).
- In interval or exponential property and zoom-and-property functions, when the feature value is not numeric.

If no default is provided, the style property's default is used in these circumstances.

{{</SectionH4>}}

{{
<SectionH4
    id="function-colorSpace"
    title="colorSpace"
>
<div>
<em className="color-gray">
    Optional{' '}
    <a href="#types-string">string</a>.
    One of
    <code>"rgb"</code>,{' '}
    <code>"lab"</code>,{' '}
    <code>"hcl"</code>.
</em>
</div>
}}

The color space in which colors
interpolated. Interpolating colors in
perceptual color spaces like LAB and HCL
tend to produce color ramps that look
more consistent and produce colors that
can be differentiated more easily than
those interpolated in RGB space.

{{
<dl className="">
<dt>
    <code>"rgb"</code>
</dt>
<dd className="mb12">
    Use the RGB color space to
    interpolate color values
</dd>
<dt>
    <code>"lab"</code>
</dt>
<dd className="mb12">
    Use the LAB color space to
    interpolate color values.
</dd>
<dt>
    <code>"hcl"</code>
</dt>
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

<strong>Zoom functions</strong> allow the appearance of a map feature to change with map’s zoom level. Zoom functions can be used to create the illusion of depth and control data density. Each stop is an array with two elements: the first is a zoom level and the second is a function output value.

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

The rendered values of <a href="#types-color">color</a>, <a href="#types-number">number</a>, and <a href="#types-array">array</a> properties are interpolated between stops. <a href="#types-boolean">Boolean</a> and <a href="#types-string">string</a> property values cannot be interpolated, so their rendered values only change at the specified stops.

There is an important difference between the way that zoom functions render for <em>layout</em> and <em>paint</em> properties. Paint properties are continuously re-evaluated whenever the zoom level changes, even fractionally. The rendered value of a paint property will change, for example, as the map moves between zoom levels <code>4.1</code> and <code>4.6</code>. Layout properties, on the other hand, are evaluated only once for each integer zoom level. To continue the prior example: the rendering of a layout property will <em>not</em> change between zoom levels <code>4.1</code> and <code>4.6</code>, no matter what stops are specified; but at zoom level <code>5</code>, the function will be re-evaluated according to the function, and the property's rendered value will change. (You can include fractional zoom levels in a layout property zoom function, and it will affect the generated values; but, still, the rendering will only change at integer zoom levels.)

<strong>Property functions</strong> allow the appearance of a map feature to change with its properties. Property functions can be used to visually differentate types of features within the same layer or create data visualizations. Each stop is an array with two elements, the first is a property input value and the second is a function output value. Note that support for property functions is not available across all properties and platforms at this time.

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

<strong>Zoom-and-property functions</strong> allow the appearance of a map feature to change with both its properties <em>and</em> zoom. Each stop is an array with two elements, the first is an object with a property input value and a zoom, and the second is a function output value. Note that support for property functions is not yet complete.

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

{{</InnerSection>
</SectionH3>
</SectionH2>}}

{{
<SectionH2
    location={this.props.location}
    id="other-filter"
    title="Other filter"
>
}}

In previous versions of the style specification, <a href="#layer-filter">filters</a> were defined using the deprecated syntax documented below. Though filters defined with this syntax will continue to work, we recommend using the more flexible <a href="#expressions">expression</a> syntax instead. Expression syntax and the deprecated syntax below cannot be mixed in a single filter definition.

{{<InnerSection>}}

{{
<SectionH4
    title="Existential Filters"
    id="existential-filters"
>
}}

<code>["has", <var>key</var>]</code> <span className="txt-bold txt-s"><var>feature[key]</var> exists</span>

<code>["!has", <var>key</var>]</code> <span className="txt-bold txt-s"><var>feature[key]</var> does not exist</span>

{{</SectionH4>}}

{{
<SectionH4
    title="Comparison Filters"
    id="comparison-filters"
>
}}

{{
<code>["==", <var>key</var>, <var>value</var>]</code> <span className="txt-bold txt-s">equality: <var>feature[key]</var> = <var>value</var></span>

<code>["!=", <var>key</var>, <var>value</var>]</code> <span className="txt-bold txt-s">inequality: <var>feature[key]</var> ≠ <var>value</var></span>

<code>["&gt;", <var>key</var>, <var>value</var>]</code> <span className="txt-bold txt-s">greater than: <var>feature[key]</var> > <var>value</var></span>

<div className="mb6">
<code>
    ["&gt;=", <var>key</var>,{' '}
    <var>value</var>]
</code>{' '}
<span className="txt-bold txt-s">
    greater than or equal:{' '}
    <var>feature[key]</var> ≥{' '}
    <var>value</var>
</span>
</div>
<div className="mb6">
<code>
    ["&lt;", <var>key</var>,{' '}
    <var>value</var>]
</code>{' '}
<span className="txt-bold txt-s">
    less than: <var>feature[key]</var> &lt;{' '}
    <var>value</var>
</span>
</div>
<div className="mb6">
<code>
    ["&lt;=", <var>key</var>,{' '}
    <var>value</var>]
</code>{' '}
<span className="txt-bold txt-s">
    less than or equal:{' '}
    <var>feature[key]</var> ≤{' '}
    <var>value</var>
</span>
</div>}}

{{</SectionH4>}}

{{
<SectionH4
    title="Set Membership Filters"
    id="set-membership Filters-filters"
>
}}

{{
<div className="mb6">
<code>
    ["in", <var>key</var>, <var>v0</var>,
    ..., <var>vn</var>]
</code>{' '}
<span className="txt-bold txt-s">
    set inclusion: <var>feature[key]</var> ∈{' '}
    {`{`}
    <var>v0</var>, ..., <var>vn</var>
    {`}`}
</span>
</div>
<div className="mb6">
<code>
    ["!in", <var>key</var>, <var>v0</var>,
    ..., <var>vn</var>]
</code>{' '}
<span className="txt-bold txt-s">
    set exclusion: <var>feature[key]</var> ∉{' '}
    {`{`}
    <var>v0</var>, ..., <var>vn</var>
    {`}`}
</span>
</div>
}}

{{</SectionH4>}}

{{
<SectionH4
    title="Combining Filters"
    id="combining-filters"
>
}}

{{
<div className="mb6">
<code>
    ["all", <var>f0</var>, ...,{' '}
    <var>fn</var>]
</code>{' '}
<span className="txt-bold txt-s">
    logical <code>AND</code>: <var>f0</var>{' '}
    ∧ ... ∧ <var>fn</var>
</span>
</div>
<div className="mb6">
<code>
    ["any", <var>f0</var>, ...,{' '}
    <var>fn</var>]
</code>{' '}
<span className="txt-bold txt-s">
    logical <code>OR</code>: <var>f0</var> ∨
    ... ∨ <var>fn</var>
</span>
</div>

<div className="mb6">
<code>
    ["none", <var>f0</var>, ...,{' '}
    <var>fn</var>]
</code>{' '}
<span className="txt-bold txt-s">
    logical <code>NOR</code>: ¬<var>f0</var>{' '}
    ∧ ... ∧ ¬<var>fn</var>
</span>
</div>
}}

A <var>key</var> must be a string that identifies a feature property, or one of the following special keys:

- <code>"$type"</code>: the feature type. This key may be used with the{' '} <code>"=="</code>,<code>"!="</code>, <code>"in"</code>, and <code>"!in"</code> operators. Possible values are <code>"Point"</code>,  <code>"LineString"</code>, and <code>"Polygon"</code>.
- <code>"$id"</code>: the feature identifier. This key may be used with the <code>"=="</code>,<code>"!="</code>, <code>"has"</code>, <code>"!has"</code>, <code>"in"</code>, and <code>"!in"</code> operators.

A <var>value</var> (and <var>v0</var>, ..., <var>vn</var> for set operators) must be a <a href="#string">string</a>, <a href="#number">number</a>, or <a href="#boolean">boolean</a> to compare the property value against.

Set membership filters are a compact and efficient way to test whether a field matches any of multiple values.

The comparison and set membership filters implement strictly-typed comparisons; for example, all of the following evaluate to false: <code>0 &lt; "1"</code>, <code>2 == "2"</code>, <code>"true" in [true, false]</code>.

The <code>"all"</code>, <code>"any"</code>, and <code>"none"</code> filter operators are used to create compound filters. The values <var>f0</var>, ..., <var>fn</var> must be filter expressions themselves.

```json
["==", "$type", "LineString"]
```

This filter requires that the <code>class</code> property of each feature is equal to either "street_major", "street_minor", or "street_limited".

```json
["in", "class", "street_major", "street_minor", "street_limited"]`
```

The combining filter "all" takes the three other filters that follow it and requires all of them to be true for a feature to be included: a feature must have a  <code>class</code> equal to "street_limited", its <code>admin_level</code> must be greater than or equal to 3, and its type cannot be Polygon. You could change the combining filter to "any" to allow features matching any of those criteria to be included - features that are Polygons, but have a different <code>class</code> value, and so on.

```json
[
    "all",
    ["==", "class", "street_limited"],
    [">=", "admin_level", 3],
    ["!in", "$type", "Polygon"]
]
```

{{
<SDKSupportTable
    thing={{
        'basic functionality': {
            js: '0.10.0',
            android: '2.0.1',
            ios: '2.0.0',
            macos: '0.1.0'
        },
        '`has` / `!has`': {
            js: '0.19.0',
            android: '4.1.0',
            ios: '3.3.0',
            macos: '0.1.0'
        }
    }}
/>
}}

{{</SectionH4>}}

{{</InnerSection>}}

{{</SectionH2>}}
