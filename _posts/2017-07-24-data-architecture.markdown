---
layout: post
title:  "Argos Data Architecture"
date:   2017-07-24 09:20:00 +0200
categories: argos data architecture documentation
---

![Argos Data Architecture](/argos/resources/backend/argos-backend-data-architecture.png)

## The Argos Data Architecture

In general, there are two main parts in the argos data: `EventTypes` with their `Events` and `EntityTypes` with their `Entities`.
The `EntityTypes` are structured in a hierarchy with  _child/parent_ relationships and each type has several attributes describing it.
An `Entity` is an instance of a certain type and has concrete values for the defined attributes.

Analogously, `EventTypes` have attributes, `Event` is a concrete instance belonging to an `EventType` and holds values for the instance.

For each `EventType`, `EventQueries` can be defined and `EventEntityMappings` connect `EventTypes` with `EntityTypes`.
Each mapping has mapping conditions to specify which attributes of `EventTypes` and `EntityTypes` are associated.
How mappings and queries work, can be found in the [workflow description](https://bptlab.github.io/argos/argos/frontend/user/documentation/workflow/2017/07/18/frontend-workflow.html).
