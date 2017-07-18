---
layout: post
title:  "Argos Frontend - General Structure and Components"
date:   2017-07-11 13:00:00 +0200
categories: argos frontend developer documentation
---

## Content

1. [The Argos Philosophy](#The-Argos-Philosophy)
2. [Used Frameworks and Libaries](#Used-Frameworks-and-Libaries)
3. [Architecture](#Architecture)



## The Argos Philosophy

The Argos Frontend (**AF**) is a [Javascript -ECMAScript 6](http://es6-features.org/) application, which is mainly built on the architecture-idea of [React](https://facebook.github.io/react/).
It is created to provide an graphical user interface for all REST routes provided by the backend application. Therefore, a working and correctly configured backend, containing a consistent dataset, is essential.

## Used Frameworks and Libaries

The Argos Frontend is build on several Frameworks and Libaries for diffrent functions. In the following all important libaries are listed and their application is described shortly.

### react
[React](https://facebook.github.io/react/) is a popular JavaScript-Framework, designed by Facebook, for creating interactive one-page User-Interfaces. The Argos Frontend is build on the architecture concept of react. Therefore, the frontend has been divided into so-called components. Each component can be called by other components. The component-architecture is described in [Architecture](#Architecture).

### react-refetch
[React Refetch](https://facebook.github.io/react/) adds the possibility to fetch data from remote data sources in a simple, declarative and composable way. Therefore, each react component receives data as a [Promise](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Promise). This simplifies dealing with asynchronously fetched data. Each component only becomes responsible for the data it needs to perform or to display.

### material-ui
[material-ui](https://github.com/callemall/material-ui) is a collection of React components that implement Google´s [Material Design](https://material.io/guidelines/material-design/introduction.html). Argos Frontend uses this library to ease the user interface creation.

### aphrodite
In order to make styling configurable Argos Frontend integrates [aphrodite](https://github.com/Khan/aphrodite). Aphrodite helps to collocate styling information into react components by explicitly using inline-style-attributes. This enables developer to adjust styling information regarding certain JavaScript states.

### plotly.js
Building and rendering of diagrams and other data visualizations is done by [plotly.js](https://plot.ly/javascript/), an svg-based charting library.

## Architecture

![Argos Frontend Architecture](/argos/resources/frontend/argos-frontend-architecture.png)

Shown above is an abstract class diagram, displaying the architecture of the Argos Frontend.
All react components are displayed as classes. For the purpose of clarity, all existing compositions have been removed from view components.
An exception to this is the *SettingsView* component. Being representative for all other View components, it shows significant compositions.
The *Utils* class encapsulates several helper functions and continuously used UI-elements.

### Data Flow
![Data Flow Diagram](/argos/resources/frontend/data-flow-diagram.jpg)

In general, data flows regarding the top-down principle, as defined by the react framework. This means, all required data is handed from parent components down to its children using react *props*.

One exception to this important rule is the way, asynchronous data is fetched from remote sources. In case a component requires external data, it fetches them on its own from the remote data source by inheriting necessary functions from *ConnectionComponent*. *ConnectionComponent* composes react-refetch and exists as an abstract class to support the exchange of data with external sources. Furthermore, *ConnectionComponent* implements an URL-based cache, in order to avoid unnecessary network load in case of identical requests. Last but not least, the *ConnectionComponent* enables the integration of mock-data for testing purpose.
