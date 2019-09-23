---
title: Layers
id: layers
description: Layers description
contentType: 'Specification'
prependJs:
    - "import SectionH3 from '../../components/style-spec/section-h3';"
    - "import InnerSection from '../../components/style-spec/inner-section';"
    - "import Item from '../../components/style-spec/item';"
    - "import { layerTypes } from '../../data/types';"
    - "import entries from 'object.entries';"
    - "import ref from '../../../mapbox-gl-js/src/style-spec/reference/latest';"
---

A style's `layers` property lists all of the layers available in that style. The type of layer is specified by the `"type"` property, and must be one of {{layerTypes.map((t, i) => <var key={i}>{t}</var>).reduce((prev, curr) => [prev, ', ', curr])}}.

Except for layers of the <var>background</var> type, each layer needs to refer to a source. Layers take the data that they get from a source, optionally filter features, and then define how those features are styled.

```json
"layers": {{JSON.stringify(
    ref.$root.layers.example,
    null,
    2
    )}}
```

{{
<InnerSection className="mb24">
    {entries(ref.layer).map(([name, prop], i) => (
        <Item
            key={i}
            id={`layer-${name}`}
            name={name}
            {...prop}
        />
    ))}
</InnerSection>
}}

Layers have two sub-properties that determine how data from that layer is rendered: `layout` and `paint` properties.

_Layout properties_ appear in the layer's `"layout"` object. They are applied early in the rendering process and define how data for that layer is passed to the GPU. Changes to a layout property require an asynchronous "layout" step.

_Paint properties_ are applied later in the rendering process. Paint properties appear in the layer's `"paint"` object. Changes to a paint property are cheap and happen synchronously.

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
