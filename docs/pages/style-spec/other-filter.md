---
title: Other filter
id: other-filter
description: Other filter description
contentType: 'Specification'
prependJs:
    - "import SectionH4 from '../../components/style-spec/section-h4';"
    - "import InnerSection from '../../components/style-spec/inner-section';"
    - "import SDKSupportTable from '../../components/sdk_support_table';"
    - "import ref from '../../../mapbox-gl-js/src/style-spec/reference/latest';"
---

In previous versions of the style specification, <a href="#layer-filter">filters</a> were defined using the deprecated syntax documented below. Though filters defined with this syntax will continue to work, we recommend using the more flexible <a href="#expressions">expression</a> syntax instead. Expression syntax and the deprecated syntax below cannot be mixed in a single filter definition.


{{<InnerSection>}}

{{<SectionH4 title="Existential Filters" id="existential-filters">}}

`["has", {{<var>key</var>}}]` <var>feature[key]</var> exists

`["!has", {{<var>key</var>}}]` <var>feature[key]</var> does not exist

{{</SectionH4>}}



{{<SectionH4 title="Comparison Filters" id="comparison-filters">}}

`["==", {{<var>key</var>}}, {{<var>value</var>}}]` equality: <var>feature[key]</var> = <var>value</var>

`["!=", {{<var>key</var>}}, {{<var>value</var>}}]` inequality: <var>feature[key]</var> ≠ <var>value</var>

`["&gt;", {{<var>key</var>}}, {{<var>value</var>]}}` greater than: <var>feature[key]</var> > <var>value</var>

`["&gt;=", {{<var>key</var>}}, {{<var>value</var>]}}` greater than or equal: <var>feature[key]</var> ≥ <var>value</var>

`["&lt;", {{<var>key</var>}}, {{<var>value</var>]}}` less than: <var>feature[key]</var> &lt; <var>value</var>

`["&lt;=", {{<var>key</var>}}, {{<var>value</var>]}}` less than or equal: <var>feature[key]</var> ≤ <var>value</var>

{{</SectionH4>}}



{{<SectionH4 title="Set Membership Filters" id="set-membership Filters-filters">}}

`["in", {{<var>key</var>}}, {{<var>v0</var>}}, ..., {{<var>vn</var>}}]` set inclusion: <var>feature[key]</var> ∈ \{<var>v0</var>, ..., <var>vn</var>\}

`["!in", {{<var>key</var>}}, {{<var>v0</var>}}, ..., {{<var>vn</var>}}]` set exclusion: <var>feature[key]</var> ∉ \{ <var>v0</var>, ..., <var>vn</var>\}

{{</SectionH4>}}



{{<SectionH4 title="Combining Filters" id="combining-filters">}}

`["all", {{<var>f0</var>}}, ..., {{<var>fn</var>}}]` logical `AND`: <var>f0</var> ∧ ... ∧ <var>fn</var>

`["any", {{<var>f0</var>}}, ..., {{<var>fn</var>}}]` logical `OR`: <var>f0</var> ∨ ... ∨ <var>fn</var>

`["none", {{<var>f0</var>}}, ..., {{<var>fn</var>}}]` logical `NOR`: ¬<var>f0</var> ∧ ... ∧ ¬<var>fn</var>

A <var>key</var> must be a string that identifies a feature property, or one of the following special keys:

- `"$type"`: the feature type. This key may be used with the{' '} `"=="`,`"!="`, `"in"`, and `"!in"` operators. Possible values are `"Point"`,  `"LineString"`, and `"Polygon"`.
- `"$id"`: the feature identifier. This key may be used with the `"=="`,`"!="`, `"has"`, `"!has"`, `"in"`, and `"!in"` operators.

A <var>value</var> (and <var>v0</var>, ..., <var>vn</var> for set operators) must be a [string](#string), [number](#number), or [boolean](#boolean) to compare the property value against.

Set membership filters are a compact and efficient way to test whether a field matches any of multiple values.

The comparison and set membership filters implement strictly-typed comparisons; for example, all of the following evaluate to false: `0 &lt; "1"`, `2 == "2"`, `"true" in [true, false]`.

The `"all"`, `"any"`, and `"none"` filter operators are used to create compound filters. The values <var>f0</var>, ..., <var>fn</var> must be filter expressions themselves.

```json
["==", "$type", "LineString"]
```

This filter requires that the `class` property of each feature is equal to either "street_major", "street_minor", or "street_limited".

```json
["in", "class", "street_major", "street_minor", "street_limited"]`
```

The combining filter "all" takes the three other filters that follow it and requires all of them to be true for a feature to be included: a feature must have a  `class` equal to "street_limited", its `admin_level` must be greater than or equal to 3, and its type cannot be Polygon. You could change the combining filter to "any" to allow features matching any of those criteria to be included - features that are Polygons, but have a different `class` value, and so on.

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
