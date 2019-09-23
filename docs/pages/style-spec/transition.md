---
title: Transition
id: transition
description: Transition description
contentType: 'Specification'
prependJs:
    - "import InnerSection from '../../components/style-spec/inner-section';"
    - "import Item from '../../components/style-spec/item';"
    - "import entries from 'object.entries';"
    - "import ref from '../../../mapbox-gl-js/src/style-spec/reference/latest';"
---

A `transition` property controls timing for the interpolation between a transitionable style property's previous value and new value. A style's <a href="#root-transition" title="link to root-transition">root `transition`</a> property provides global transition defaults for that style. Any transitionable style property may also have its own `-transition` property that defines specific transition timing for that specific layer property, overriding the global `transition` values.

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
