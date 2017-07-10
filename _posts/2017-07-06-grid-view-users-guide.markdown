---
layout: post
title:  "A users guide to the Grid-View"
date:   2017-07-06 14:15:00 +0200
categories: jekyll update documentation
---

![alt text](/argos/resources/grid-view.jpg "Grid-View")

The Grid-View is divided into 4 major components. An entity hierarchy, a search bar, a state distribution diagram and a grid showing all entities of a hierarchy level.

# Entity type hierarchy

![alt text](/argos/resources/grid-view-hierarchy.jpeg "Grid-View entity type hierarchy")

The entity type hierarchy shows the hierarchy of already chosen entities and the actual entity type. It is possible to navigate to already chosen entities, by clicking them.

# Search bar

![alt text](/argos/resources/grid-view-search-bar.jpeg "Grid-View search bar")

The search bar filters the entity grid displayed below. It is possible to search for multiple values, by separating them with comma. To filter for `hello` and `world`, one would search for `hello,world`. Furthermore, it is possible to filter for certain attributes only by typing the attribute name followed by a colon and the attribute value. Searching for an entity with the `name` `Product 1`, one would type `name:Product 1`.

# State distribution diagram

![alt text](/argos/resources/grid-view-state-distribution-diagram.jpeg "Grid-View state distribution diagram")

The state distribution diagram shows the percentage entities having a certain state. It updates while filtering the entity grid.

# Entity grid

![alt text](/argos/resources/grid-view-entity-grid.jpeg "Grid-View entity grid")

The entity grid shows children of a parent entity, previously selected through the Grid-View and filtered by the search bar. Each entity is displayed as a card showing a selection of attributes and giving two navigation possibilities. `children` navigates deeper into the Grid-View by displaying child entities of the clicked entity. `inspect` navigates to the Detail-View, showing further details and specific events for an entity.