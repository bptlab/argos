---
layout: page
title: Documentation
permalink: /documentation/
---

1. [Installation](https://bptlab.github.io/argos/documentation#Installation)

# Installation

## Prerequisites
1. [Docker](https://www.docker.com/)
1. [Docker compose](https://docs.docker.com/compose/install/)

## Deployment

1. Clone the wiki-resources repository.

    ```git clone git@github.com:bptlab/wiki-resources.git```
1. Move into the argos-deployment directory.

    ```cd wiki-resources/argos-deployment```
1. Configure external host and database name.

    Therefore change the following files according to your needs:
    - ```argos-deployment/deployment-config/host.env```
    - ```argos-deployment/deployment-config/database.env```
1. Change Argos configuration files, mount static data and default event types. (optional)

    See the [Argos configuration](https://github.com/bptlab/wiki-resources/wiki/argos-configuration) article for detailed instructions and config possibilities.
1. Run docker-compose.

    ```docker-compose up```
