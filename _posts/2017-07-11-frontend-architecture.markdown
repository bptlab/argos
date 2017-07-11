---
layout: post
title:  "Argos Frontend - General Structure and Components"
date:   2017-07-11 13:00:00 +0200
categories: argos frontend developer documentation
---

### Content

1. [The Argos Philosophy](#The-Argos-Philosophy)
1. [Architecture](#Architecture)
    1. [DatabaseAccess](#DatabaseAccess)
    2. [EventReceiver](#EventReceiver)
    3. [EventSubscriber](#EventSubscriber)
    4. [ArtifactInterface](#ArtifactInterface)
    5. [NotificationService](#NotificationService)


## The Argos Philosophy

The ArgosFrontend (**AF**) is a [Javascript -ECMAScript 6](http://es6-features.org/) application, which makes use of [React](https://facebook.github.io/react/) for data and call-flow.
It is build to provide an graphical user interface for all REST routes provided by the backend application. Therefore, a working and correctly configured backend, containing a consistent dataset, is essential.

## Architecture

![ArgosBackend Architecture](/argos/resources/frontend/argos-frontend-architecture.png)

Shown above is an abstract class diagram, displaying the architecture of the ArgosFrontend.

### DatabaseAccess

### EventReceiver

### EventSubscriber

### ArtifactInterface

### NotificationService
