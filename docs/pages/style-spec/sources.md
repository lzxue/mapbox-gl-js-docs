---
title: Sources
id: sources
description: Sources description
contentType: 'Specification'
prependJs:
    - "import SectionH3 from '../../components/style-spec/section-h3';"
    - "import InnerSection from '../../components/style-spec/inner-section';"
    - "import Item from '../../components/style-spec/item';"
    - "import { sourceTypes } from '../../data/types';"
    - "import SDKSupportTable from '../../components/sdk_support_table';"
    - "import entries from 'object.entries';"
    - "import ref from '../../../mapbox-gl-js/src/style-spec/reference/latest';"
---

Sources supply data to be shown on the map. The type of source is specified by the `"type"` property, and must be one of {{sourceTypes.map((t, i) => {
    return <var key={i}>{t}</var>;
}).reduce((prev, curr) => {
    return [prev, ', ', curr]
})}}. Adding a source won't immediately make data appear on the map because sources don't contain styling details like color or width. Layers refer to a source and give it a visual representation. This makes it possible to style the same source in different ways, like differentiating between types of roads in a highways layer.

Tiled sources (vector and raster) must specify their details in terms of the [TileJSON specification](https://github.com/mapbox/tilejson-spec). This can be done in several ways:

- By supplying TileJSON properties such as `"tiles"`, `"minzoom"`, and `"maxzoom"` directly in the source:

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

- By providing a `"url"` to a TileJSON resource:

```json
"mapbox-streets": {
    "type": "vector",
    "url": "http://api.example.com/tilejson.json"
}
```

- By providing a url to a WMS server that supports EPSG:3857 (or EPSG:900913) as a source of tiled data. The server url should contain a `"{bbox-epsg-3857}"` replacement token to supply the `bbox` parameter.

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

A vector tile source. Tiles must be in [Mapbox Vector Tile format](https://docs.mapbox.com/vector-tiles/). All geometric coordinates in vector tiles must be between `-1 * extent` and `(extent * 2) - 1` inclusive. All layers that use a vector source must specify a [`"source-layer"`](#layer-source-layer) value. For vector tiles hosted by Mapbox, the `"url"` value should be of the form  <code>mapbox://<var>mapid</var></code>.

```json
"mapbox-streets": {
    "type": "vector",
    "url": "mapbox://mapbox.mapbox-streets-v6"
}
```

<!-- This is generated from the specification. See https://github.com/mapbox/mapbox-gl-js/tree/master/src/style-spec -->

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

A raster tile source. For raster tiles hosted by Mapbox, the `"url"` value should be of the form <code>mapbox://<var>mapid</var></code>.

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

A raster DEM source. Currently only supports [Mapbox Terrain RGB](https://blog.mapbox.com/global-elevation-data-6689f1d0ba65) (`mapbox://mapbox.terrain-rgb`):

```json
"mapbox-terrain-rgb": {
    "type": "raster-dem",
    "url": "mapbox://mapbox.terrain-rgb"
}
```

<!-- This is generated from the specification. See https://github.com/mapbox/mapbox-gl-js/tree/master/src/style-spec -->

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

A [GeoJSON](http://geojson.org/) source. Data must be provided via a `"data"` property, whose value can be a URL or inline GeoJSON.

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

This example of a GeoJSON source refers to an external GeoJSON document via its URL. The GeoJSON document must be on the same domain or accessible using [CORS](http://enable-cors.org/).

```json
"geojson-lines": {
    "type": "geojson",
    "data": "./lines.geojson"
}
```

<!-- This is generated from the specification. See https://github.com/mapbox/mapbox-gl-js/tree/master/src/style-spec -->

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

An image source. The `"url"` value contains the image location.

The `"coordinates"` array contains `[longitude, latitude]` pairs for the image corners listed in clockwise order: top left, top right, bottom right, bottom left.

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

A video source. The `"urls"` value is an array. For each URL in the array, a video element [source](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source) will be created, in order to support same media in multiple formats supported by different browsers.

The `"coordinates"` array contains `[longitude, latitude]` pairs for the video corners listed in clockwise order: top left, top right, bottom right, bottom left.

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
