---
title: Types
id: types
description: A Mapbox style contains values of various types, most commonly as values for the style properties of a layer.
contentType: specification
prependJs:
    - "import SectionH3 from '../../components/style-spec/section-h3';"
---

A Mapbox style contains values of various types, most commonly as values for the style properties of a layer.

{{<SectionH3 id="types-color" title="Color">}}

The `color` type represents a color in the [sRGB color space](https://en.wikipedia.org/wiki/SRGB). Colors are written as JSON strings in a variety of permitted formats: HTML-style hex values, rgb, rgba, hsl, and hsla. Predefined HTML colors names, like `yellow` and `blue`, are also permitted.

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

Especially of note is the support for hsl, which can be [easier to reason about than rgb()](http://mothereffinghsl.com/).

{{</SectionH3>}}

{{<SectionH3 id="types-formatted" title="Formatted">}}

The `formatted` type represents a string broken into sections annotated with separate formatting options.

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

Boolean means yes or no, so it accepts the values `true` or `false`.

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

Arrays are comma-separated lists of one or more numbers in a specific order. For example, they're used in line dash arrays, in which the numbers specify intervals of line, break, and line again.

```json
{
    "line-dasharray": [2, 4]
}
```

{{</SectionH3>}}
