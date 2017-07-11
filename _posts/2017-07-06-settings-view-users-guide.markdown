---
layout: post
title:  "A users guide to the Settings-View"
date:   2017-07-06 14:15:00 +0200
categories: jekyll update documentation
---

The Settings-View can be entered over the gear wheel icon in the top right corner of the Grid-View or the Detail-View. It shows event types, their attributes, queries for each event type and the corresponding event-entity-mappings.

## Structure

1. Settings-View
    1. [Event Types](#event-types)
        1. [Event Type Attributes](#event-type-attributes)
        1. [Event Queries](#event-queries)
        1. [Event-Entity-Mappings](#event-entity-mappings)

## Event Types

<video style="width: 100%; height: auto; box-shadow: 0px 0px 5px #888888;" autoplay loop>
  <source src="/argos/resources/settings-view-event-types.webm" type="video/webm">
  Your browser does not support the video tag.
</video><p></p>

While entering the Settings-View, all event types are displayed as collapsed cards. Each card can be expanded by clicking, to display attributes, event queries and event-entity-mappings of the corresponding event type. Additionally, new event types can be created by clicking the plus icon in the bottom right corner of the page.

### Event Type Attributes

<video style="width: 100%; height: auto; box-shadow: 0px 0px 5px #888888;" autoplay loop>
  <source src="/argos/resources/settings-view-event-type-attributes.webm" type="video/webm">
  Your browser does not support the video tag.
</video><p></p>

While expanding a card of an event type, the first tab labeled "Attributes" will be selected, showing all attributes of that event type. This list of attributes is especially useful while creating new queries for an event type.

### Event Queries

<video style="width: 100%; height: auto; box-shadow: 0px 0px 5px #888888;" autoplay loop>
  <source src="/argos/resources/settings-view-event-queries.webm" type="video/webm">
  Your browser does not support the video tag.
</video><p></p>

The second tab labeled "Event Queries" displays all queries for a certain event type. It is possible to edit and delete queries through the icons on the right side of each query. New event queries can be created by clicking the plus icon in the bottom right corner of the event queries tab. Event queries are written in Esper, an event processing language. The Esper documentation is maintained by EsperTech and can be found on their [website](http://www.espertech.com/esper/documentation.php).

### Event-Entity-Mappings

<video style="width: 100%; height: auto; box-shadow: 0px 0px 5px #888888;" autoplay loop>
  <source src="/argos/resources/settings-view-event-entity-mappings.webm" type="video/webm">
  Your browser does not support the video tag.
</video><p></p>

The last tab "Entity Mappings" displays all Event-Entity-Mappings for a certain event type.  Each mapping consists of an event type and an entity type and corresponding attributes. The values of the given attributes have to match each other to successfully assign an event to a certain entity. It is possible to edit and delete queries through the icons on the right side of each query. Furthermore, new Event-Entity-Mappings can be created by clicking the plus icon in the bottom right corner of the Event-Entity-Mappings tab.
