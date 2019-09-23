---
title: Root properties
id: root
description: Root properties description
contentType: 'Specification'
prependJs:
    - "import InnerSection from '../../components/style-spec/inner-section';"
    - "import Item from '../../components/style-spec/item';"
    - "import entries from 'object.entries';"
    - "import ref from '../../../mapbox-gl-js/src/style-spec/reference/latest';"
---

Root level properties of a Mapbox style specify the map's layers, tile sources and other resources, and default values for the initial camera position when not specified elsewhere.

```json
{
    "version":{{ref.$version}},
    "name": "Mapbox Streets",
    "sprite": "mapbox://sprites/mapbox/streets-v{{ref.$version}}",
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
