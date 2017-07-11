---
layout: post
title:  "A users guide to the Detail-View"
date:   2017-07-11 14:15:00 +0200
categories: jekyll update documentation
---

The Detail-View is divided into 4 major components. Entity details, an events over time diagram, a filter bar and a table showing all events of a certain event type. This view shows details to a selected entity. Entities depend on data and can, for example, be products, product categories or parts.

# Entity Details

<video style="width: 100%; height: auto;" autoplay loop>
  <source src="/argos/resources/detail-view-entity-details.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

Entity details show a set of attributes and their values for the currently selected entity. This is a preselected set of attributes and does not display all attributes of an entity. If an important attribute is missing and should be displayed, please contact your solution engineer.

# Events over Time Diagram

<video style="width: 100%; height: auto;" autoplay loop>
  <source src="/argos/resources/detail-view-events-over-time-diagram.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

The events over time diagram gives an overview of displayed events of a selected event type. It is altered by filters and will only display events currently shown in the event table. You can move the diagram by dragging and dropping it or zoom inside the diagram by selecting a certain area with the mouse. Furthermore, if you hover the diagram a toolbar will be displayed above, showing more options.

# Filter Bar

<video style="width: 100%; height: auto;" autoplay loop>
  <source src="/argos/resources/detail-view-filter-bar.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

The filter bar limits the event table displayed below. It is possible to filter for multiple values, by separating them with a comma. To filter for `hello` and `world`, one would input `hello,world`. Furthermore, it is possible to filter for certain event attributes (table headers) by typing the attribute name followed by a colon and the attribute value. Searching for an event with the `id` `42`, one would type `id:42`. Additionally, every time a filter is filled with content, another filter will appear giving you the possibility to limit the search by multiple keywords.

# Event Table

<video style="width: 100%; height: auto;" autoplay loop>
  <source src="/argos/resources/detail-view-event-table.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

The event table shows all events of the currently chosen event type matching the inputs of the filter bar. To change between event types use the tabs above the table. By default, only the latest events will be shown. If you are interested in events that occurred in the past, use the scrolling function to see more events or the filter bar to limit the table to certain dates or times.