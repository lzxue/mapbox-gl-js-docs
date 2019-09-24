---
title: Light
id: light
description: Light description
contentType: 'Specification'
prependJs:
    - "import InnerSection from '../../components/style-spec/inner-section';"
    - "import Item from '../../components/style-spec/item';"
    - "import entries from 'object.entries';"
    - "import ref from '../../../mapbox-gl-js/src/style-spec/reference/latest';"
---

A style's `light` property provides global light source for that style.

```json
"light": {{JSON.stringify(
    ref.$root.light.example,
    null,
    2
)}}
```

<!--
START GENERATED CONTENT:
Content in this section is generated directly using the Mapbox Style
Specification. To update any content displayed in this section, make edits to:
https://github.com/mapbox/mapbox-gl-js/blob/master/src/style-spec/reference/v8.json.
-->
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
<!-- END GENERATED CONTENT -->
