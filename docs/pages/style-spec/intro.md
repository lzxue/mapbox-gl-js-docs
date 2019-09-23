---
title: Style Specification
id: intro
description: 'This specification defines and describes the visual appearance of a map: what data to draw, the order to draw it in, and how to style the data when drawing it.'
contentType: 'Specification'
---

A Mapbox style is a document that defines the visual appearance of a map: what data to draw, the order to draw it in, and how to style the data when drawing it. A style document is a [JSON](http://www.json.org/) object with specific root level and nested properties. This specification defines and describes these properties.

The intended audience of this specification includes:

- Advanced designers and cartographers who want to write styles by hand rather than use [Mapbox Studio](https://studio.mapbox.com).
- Developers using style-related features of [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) or the [Mapbox Maps SDK for Android](https://docs.mapbox.com/android/).
- Authors of software that generates or processes Mapbox styles.


For platform-appropriate documentation of style-related features, developers using the Mapbox Maps SDK for iOS should consult the [iOS SDK API reference](https://docs.mapbox.com/ios/maps/overview/), and developers using the Mapbox Maps SDK for macOS should consult the [macOS SDK API reference](https://mapbox.github.io/mapbox-gl-native/macos/).
