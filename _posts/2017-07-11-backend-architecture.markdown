---
layout: post
title:  "Argos Backend - General Structure and Components"
date:   2017-07-11 13:00:00 +0200
categories: argos backend developer documentation
---

### Content

1. [The Argos Philosophy](#The-Argos-Philosophy)
    1. [Architecture](#Architecture)

## The Argos Philosophy

The ArgosBackend (**AB**) is a [Java 8](https://www.java.com/en/download/faq/java8.xml) application, which uses [Maven](https://maven.apache.org/) for project management.
It is build to be as flexible as possible, allowing future egineers to extend the functionality. Thus, some critical design decisions will be depicted in the following chapters.

### Architecture

![ArgosBackend Architecture](/agros/resources/backend/argos-backend-architecture.png)