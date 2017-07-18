---
layout: post
title:  "Argos Frontend - Workflow Description"
date:   2017-07-18 08:00:00 +0200
categories: argos frontend user documentation workflow
---

## An Argos introduction for users
This page will explain the basic workflow with the Argos front end and will help the user to get started the first time, the application is used.
Headlines should be seen as a structuring element but this guide is meant to be read in a row.

#### A guide to entity mappings
Starting with a new front end, there are a few steps for users to do before first events can be viewed.
The first time the front end is opened, there should already be a few entities in the [`Grid-View`](https://bptlab.github.io/argos/jekyll/update/documentation/2017/07/06/grid-view-users-guide.html).
But when inspecting them, no associated events might be shown.

Initially, the system does not know how to match occurring events with the correct entity.
To make the system aware of connections between event type attributes and entity attributes, entity mappings need to be created for each event type.
The [`Settings-View`](https://bptlab.github.io/argos/jekyll/update/documentation/2017/07/06/settings-view-users-guide.html) shows a list of all currently available event types and offers several options for them.
By clicking the "plus" button on the "entity mappings" tab, the [`Entity-Mappings-View`](https://bptlab.github.io/argos/jekyll/update/documentation/2017/07/06/settings-view-users-guide.html#event-entity-mappings) opens.
Here, the user can define how arriving events will be associated with the correct entity.
By choosing the event and entity type, a list with available attributes shows up and they can be connected.
How this works will be explained based on an example:

![ArgosFrontend Architecture](/argos/resources/user/usage-flow/entity-mapping.png)

This mapping defines that arriving `ExpectedArrivalChanged` events will be mapped to `Line` entities, based on the values of _lineId_ and _transportationModeId_.
The system will now search for `Line` entities with the exactly same values as they appeared in the event.
An `ExpectedArrivalChanged` event with _lineId_ 12 and _transportationModeId_ 979 will be assigned to the `Line` entity having the _name_ 12 and _modeName_ 979.

As each entity has a status representing the entity's current condition, an event type can be configured to change the status in case an event arrives.
Therefore, a mapping also allows to specify this status change for the affected entity.

Now, arriving events will be correctly mapped to their entities and the entity's status can change.

#### A guide to event types and queries
While using Argos, the initial event types might not suffice and, for example, the event stream should be analyzed for pattern.
Again, in the [`Settings-View`](https://bptlab.github.io/argos/jekyll/update/documentation/2017/07/06/settings-view-users-guide.html), a new event type can be added by pressing "plus" in the right, bottom corner.
Here, a name for the time stamp, the name for the time stamp attribute as well as custom attributes can be defined.
After saving, the new event type can be found in the list of event types.
To make the system aware of how to fetch or generate events for the new event type, a query is needed.
Queries can be added, analogously to entity mappings, on the "event queries" tab by pressing "plus".
Next to a description for this query, an input field for the query itself is provided.
The input syntax for queries can be found in the Esper Reference ([Version 5.3.0 documentation](http://www.espertech.com/esper/release-5.3.0/esper-reference/html/)).
After saving the query, the system now knows how events for this certain event type should be produced and each time the query matches, events will be generated.
Of course, to be able to assign events to the correct entity, an entity mapping needs to be configured for the event type as described above.
