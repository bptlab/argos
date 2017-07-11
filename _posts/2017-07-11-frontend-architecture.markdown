---
layout: post
title:  "Argos Frontend - General Structure and Components"
date:   2017-07-11 13:00:00 +0200
categories: argos frontend developer documentation
---

### Content

1. [The Argos Philosophy](#The-Argos-Philosophy)
1. [Architecture](#Architecture)



## The Argos Philosophy

The ArgosFrontend (**AF**) is a [Javascript -ECMAScript 6](http://es6-features.org/) application, which makes use of [React](https://facebook.github.io/react/) for data and call-flow.
It is build to provide an graphical user interface for all REST routes provided by the backend application. Therefore, a working and correctly configured backend, containing a consistent dataset, is essential.

## Architecture

![ArgosFrontend Architecture](/argos/resources/frontend/argos-frontend-architecture.png)

Shown above is an abstract class diagram, displaying the architecture of the ArgosFrontend. 
All react components are displayed as classes. For the purpose of clarity, all existing compositions have been removed from view components.
An exception  to this is the *SettingsView* component. Being representative for all other View components, it shows significant compositions.
The *Utils* class encapsulates several helper functions and continuously used UI-elements. 
