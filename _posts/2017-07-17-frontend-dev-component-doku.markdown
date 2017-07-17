---
layout: post
title:  "Argos Frontend - React Components"
date:   2017-07-17 08:30:00 +0200
categories: argos frontend developer documentation
---

## Content

1. [Introduction to Argos components](#introduction-to-argos-components)
1. [DetailView](#detailview)
    1. [EventDiagram](#eventdiagram)
    1. [EventTable](#eventtable)
    1. [EventTabs](#eventtabs)
1. [GridView](#gridview)
    1. [CardGrid](#cardgrid)
    1. [EntityCard](#entitycard)
    1. [HierarchyStepper](#hierarchystepper)
    1. [StatusDiagram](#statusdiagram)


## Introduction to Argos components
The Argos front end comprises of several [REACT](https://facebook.github.io/react/) components.
In the [argos front end project](https://github.com/bptlab/argos-frontend), most components are structured corresponding the views they are used in:
For example, the `HierarchyStepper` can be found in the `GridView`-folder, as it is only used by this view.
More common components, that are reused within the project, like buttons or notification, are located in the `Utils`-folder.

Components that need a data-connection to the back end are not plain REACT components but inherit from the `ConnectionComponent`, to simplify the process of fetching data.
More information regarding this component and the used framework can be found in (TODO: ADD LINK).

Hereinafter, the components will be briefly introduced and explained, following the project's file structure.

## DetailView
The `DetailView` component structures and builds the page showing details to any entity.
It fetches information about the concerned entity and connected event types, as well as available events.
This data is then passed down to the child components introduced down below.
This component subscribes to _Event_ and _Entity_ notifications and will refresh in case the back end reports new information.

### EventDiagram
Each event for the current entity and selected event type represents a data point in the `EventDiagram`.
This component receives the event, event type with attributes and entity information.
It then sorts all events by their time stamp and computes for each date how many events occurred so far.
While rendering, the graph is colored corresponding the entity's status.

### EventTable
The `EventTable` shows the events for the selected event type and entity.
It has no logic for processing or filtering events and simply displays all passed event data combined with the given information about the event type.
All filtering logic is performed in the `DetailView`.
If the amount of events is to large, the `DetailView` will only pass chunks of event data to this table component and fetch more data as soon as the user scrolls to the page end.

### EventTabs
This component displays a tab for each passed event type and triggers a handler with the newly selected type in case the user selects a tab.
The `EventTab` component is used within in the `DetailView` to let the user select the type of events that should be displayed for the current entity.


## GridView
The `GridView` fetches information about the current entity.
Next to a `SearchBar`, whose filter value is passed to all `CardGrid` elements rendered for each type of available child entities, it shows the `HierarchyStepper`.

### CardGrid
A `CardGrid` element receives a parent entity and an entity type.
It then renders an `EntityCard` for each entity of the correct entity type and being a child of the given parent entity, after fetching the corresponding information.
Single entities might be hidden in case a filter is applied and does not match this entity.
To provide a quick overview how the statusus are distributed within the entity type, a `StatusDiagram` is shown.

### EntityCard
The `EntityCard` component needs an entity object as a parameter, as well as the id of the parent entity.
It renders information concerning the entity utilizing the `Utils/EntityInformation` component.
Also links for browsing all children of the given entity or inspecting the events for this entity are build and displayed.

### HierarchyStepper
Using the hierarchy's structure, the current entity with its type and available child entity types, the `HierarchyStepper` renders a graph showing parent entity types and the first level of child entity types.
For rendering, the material ui classes `Stepper` and `StepLabel` are used.

### StatusDiagram
Receiving entity objects, the `StatusDiagram` component extracts the status information from them and renders a stacked, horizontal bar chart, visualizing the distribution of the different statutes.
