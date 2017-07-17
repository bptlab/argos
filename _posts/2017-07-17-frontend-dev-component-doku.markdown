---
layout: post
title:  "Argos Frontend - React Components"
date:   2017-07-17 08:30:00 +0200
categories: argos frontend developer documentation
---

## Content

1. [Introduction to Argos components](#introduction-to-argos-components)
1. [App](#app)
1. [Header](#header)
1. [DetailView](#detailview)
    1. [EventDiagram](#eventdiagram)
    1. [EventTable](#eventtable)
    1. [EventTabs](#eventtabs)
1. [GridView](#gridview)
    1. [CardGrid](#cardgrid)
    1. [EntityCard](#entitycard)
    1. [HierarchyStepper](#hierarchystepper)
    1. [StatusDiagram](#statusdiagram)
1. [SettingsView](#settingsview)
    1. [EntityMappingListItem](#entitymappinglistitem)
    1. [EventQueryListItem](#eventquerylistitem)
    1. [EventTypeCard](#eventtypecard)
1. [Create views](#create-views)
    1. [CreateEntityMappingView](#createentitymappingview)
    1. [CreateEventQueryView](#createeventqueryview)
        1. [EventQueryInputArea](#eventqueryinputarea)
        1. [EventTypeInformation](#eventtypeinformation)
    1. [CreateEventTypeView](#createeventtypeview)
1. [Utils](#utils)
    1. [ChangeNotifier](#changenotifier)
    1. [ConfirmationMessage](#confirmationmessage)
    1. [ConnectionCache](#connectioncache)
    1. [ConnectionComponent](#connectioncomponent)
    1. [EntityInformation](#entityinformation)
    1. [ErrorMessage](#errormessage)
    1. [FilterBar](#filterbar)
    1. [HelpButton](#helpbutton)
    1. [LoadingAnimation](#loadinganimation)
    1. [NotFound](#notfound)
    1. [Notification](#notification)
    1. [RestRoutesManager](#restroutesmanager)
    1. [SearchBar](#searchbar)

---


## Introduction to Argos components
The Argos front end comprises of several [REACT](https://facebook.github.io/react/) components.
In the [argos front end project](https://github.com/bptlab/argos-frontend), most components are structured corresponding the views they are used in:
For example, the [`HierarchyStepper`](#hierarchystepper) can be found in the [`GridView`](#gridview)-folder, as it is only used by this view.
More common components, that are reused within the project, like buttons or notification, are located in the [`Utils`](#utils)-folder.

Components that need a data-connection to the back end are not plain REACT components but inherit from the [`ConnectionComponent`](#connectioncomponent), to simplify the process of fetching data.
More information regarding this component and the used framework can be found in (TODO: ADD LINK).

Hereinafter, the components will be briefly introduced and explained, following the project's file structure.

---


## App
The `App` component fetches the entity type hierachy from the back end and saves it globally into the _window_ variable _hierarchy_.
It also wraps the theme provider from material ui around the front end's pages.

---


## Header
This component defines a REACT `Router` with all available routes and the components behind them.
To allow a simple navigation throughout the front end, the `Header` component provides buttons, like a back button, help and settings button, as well as a headline for the page itself, depending on the current view.
Here, the logic for navigating in the browser's history is located as well.
The `Header` component is embedded by the different views and takes a page title and optionally a status of an entity that can be visualized.

---


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
All filtering logic is performed in the [`DetailView`](#detailview).
If the amount of events is to large, the [`DetailView`](#detailview) will only pass chunks of event data to this table component and fetch more data as soon as the user scrolls to the page end.

### EventTabs
This component displays a tab for each passed event type and triggers a handler with the newly selected type in case the user selects a tab.
The `EventTabs` component is used within in the [`DetailView`](#detailview) to let the user select the type of events that should be displayed for the current entity.

---


## GridView
The `GridView` fetches information about the current entity.
Next to a [`SearchBar`](#searchbar), whose filter value is passed to all `CardGrid` elements rendered for each type of available child entities, it shows the [`HierarchyStepper`](#hierarchystepper).

### CardGrid
A `CardGrid` element receives a parent entity and an entity type.
It then renders an [`EntityCard`](#entitycard) for each entity of the correct entity type and being a child of the given parent entity, after fetching the corresponding information.
Single entities might be hidden in case a filter is applied and does not match this entity.
To provide a quick overview how the statusus are distributed within the entity type, a [`StatusDiagram`](#statusdiagram) is shown.

### EntityCard
The `EntityCard` component needs an entity object as a parameter, as well as the id of the parent entity.
It renders information concerning the entity utilizing the `[Utils](#utils)/[EntityInformation](#entityinformation)` component.
Also links for browsing all children of the given entity or inspecting the events for this entity are build and displayed.

### HierarchyStepper
Using the hierarchy's structure, the current entity with its type and available child entity types, the `HierarchyStepper` renders a graph showing parent entity types and the first level of child entity types.
For rendering, the material ui classes `Stepper` and `StepLabel` are used.

### StatusDiagram
Receiving entity objects, the `StatusDiagram` component extracts the status information from them and renders a stacked, horizontal bar chart, visualizing the distribution of the different statutes.

---


## SettingsView
The `SettingsView` component renders a [`SearchBar`](#searchbar) along with [`EventTypeCard`](#eventtypecard) elements for each event type registered in the system.
The list of shown event types can be constrained by input from the search bar.

### EntityMappingListItem
This component shows information to a given entity mapping and offers action buttons, takes a callback function for deleting this mapping and also needs event type information.
It renders the concerned event type and entity name, together with all mapping conditions.
In addition, buttons for editing and deleting the mapping are created.

### EventQueryListItem
Using a `ListItem`, this component shows the description and the value of a given query.
Also, buttons for editing and deleting the query are rendered.

### EventTypeCard
This component renders a collapsible overview of a given event type.
It comprises of general event type information, like the name and the number of registered events, as well as tabs for showing the event type attributes, associated queries (using an [`EventQueryListItem`](#eventquerylistitem)) and registered mappings (using [`EntityMappingListItem`](#entitymappinglistitem) elements) for this event type.

---

## Create views
The following views can be reached from the [`SettingsView`](#settingsview) and allow to add and edit different objects in the system.

### CreateEntityMappingView
This component fetches available event types and entity types and allows to create and edit mappings between their attributes.
After an event type or entity type is selected the corresponding event type attributes or respectively entity attributes are requested and then displayed in dropdowns.

### CreateEventQueryView
The `CreateEventQueryView` component allows to add and edit a new query, using the [`EventQueryInputArea`](#eventqueryinputarea).
In case, a query should be edited, it is split at the "FROM" part, to ensure the user can not edit the "SELECT" part before, as this needs to be fixed and not changeable.
The single functions in this component are documented within the code.

#### EventQueryInputArea
This component renders two `TextField` elements, one for the query description and another one for the query itself.
In case a query should be edited, the "SELECT" part is added to the floating hint text.

#### EventTypeInformation
Using a list of event type attributes, this component renders a material ui `Card` with a list of these attributes.

### CreateEventTypeView
The `CreateEventTypeView` component renders a form for creating new event types.
Next to two fixed input fields for the event type name and the time stamp attribute name, a dynamic list of input fields is rendered, so the user can provide any number of event type attributes.

---


## Utils
The `Utils` class is not a REACT component but provides several functions that are used throughout the project.
All available functions are well documented within the code.

### ChangeNotifier
To be able to receive notifications from the back end in case information changed, the `ChangeNotifier` class allows other components to register for certain notifications and will invoke the callback provided during registration.

### ConfirmationMessage
This REACT component opens a material ui `Dialog` with an abort and confirm button.

### ConnectionCache
Working with the browser's _sessionStorage_, this component implements a basic cache, where received data is stored mapped to the requested url.
It allows to retrieve this data by providing an url, as well as cache entries can be invalidated for each url or notification individually.

### ConnectionComponent
The `ConnectionComponent` inherits from the REACT `Component` and works as a wrapper for project specific refetch adjustments.
It decides whether a request will be satisfied from mock data, from the cache or from a back end request.
This component also takes care of caching successful requests and parsing JSON responses.

### EntityInformation
For a given entity object, the `EntityInformation` component renders a list with all attributes associated with this entity along with their corresponding values.

### ErrorMessage
A simple component to display a given string next to a warning sign in a visual container.

### FilterBar
The `FilterBar` component groups [`SearchBar`](#searchbar) elements and grows with the user's input, meaning that there always is an empty input field to allow any combinations of filters.
It requires a callback where all set filters will be submitted everytime the input changes.
Optionally, a source for autocompleting can be provided and whether the input fields allow the creation of filters by columns (if this is enabled, the user can type "columnname:search term" to create a filter only working on a specific "columnname", searching for the "search term").

### HelpButton
This component is used by the `Header` and displays an help icon.
By clicking this icon, the help elements on the page will be toggled.
Help elements can be added using the [introJS](http://introjs.com/) framework.

### LoadingAnimation
`LoadingAnimation` acts as a wrapper for the material ui's `CircularProgress`, visualizing an indefinitely loading process.
This component is for example used to bridge the loading time for back end requests.

### NotFound
Renders an [`ErrorMessage`](#errormessage) with a _404_ error message.

### Notification
This component shows success or error notifications at the bottom of the page, containing a fitting icon and a given notification message.

### RestRoutesManager
This map contains regex expressions matching the api routes.
It defines the functions that should be called when working with mock data and also contains a boolean value whether this route should be cached or not.

### SearchBar
The `SearchBar` component renders an input field, that can use a given autocomplete source accompanied by a button for clearing the user input.
In case the _useColumns_ option is set, the user can limit the current search/filter to a specific attribute or column, by dividing the column name from the search term with an ":".
The component will visualize this separation by showing the column name as a floating text above the search term.
Every time the input changes, the components invokes the given callback with its id, the search term and optionally the column name the user specified.
The usage and most important functionalities are also documented within the class.
