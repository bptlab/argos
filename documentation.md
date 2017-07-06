---
layout: page
title: Documentation
permalink: /documentation/
---

## Structure

1. [Installation](#installation)
    1. [Prerequisites](#prerequisites)
    1. [Installation Guide](#installation-guide)
1. [Configuration](#configuration)
    1. [Example Configuration](#example-configuration)
    1. [Frontend Configuration](#frontend-configuration)
    1. [Attribute Configuration](#attribute-configuration)
    1. [Help Configuration](#help-configuration)
    1. [Backend, Unicorn and NGINX Configuration](#backend-unicorn-and-nginx-configuration)
    1. [Static data](#static-data)
    1. [Basic event types](#basic-event-types)

## Installation

### Prerequisites
1. [Docker engine](https://www.docker.com/) - version 1.13.0+
1. [Docker compose](https://docs.docker.com/compose/install/) - version 1.10.0+

### Installation Guide

1. Clone the [argos repository](https://github.com/bptlab/argos).

    ```git clone git@github.com:bptlab/argos.git```
1. (Optional) Switch to another branch containing an example configuration.

    ```git checkout tfl_config_example```
1. Move to the deployment directory.

    ```cd argos/deployment```
1. Configure external host and database name.

    Therefore change the following files according to your needs:
    - ```/deployment/deployment-config/host.env```
    - ```/deployment/deployment-config/database.env```
1. (Optional) Change other configuration files.

    Please refer to [configuration](#configuration) for detailed instructions and configuration possibilities.
1. When finished configuring, run docker-compose.

    ```docker-compose up```


## Configuration

### Example Configuration

There already are two example branches set up to give guidance how to configure the Argos Dashboard.
1. Transport for London example: ```tfl_config_example``` branch.
1. BoschTT IoT example: ```bosch_config_example``` branch.

### Frontend Configuration

Use the frontend configuration file ([```/deployment/config/frontend-config.js```](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/config/frontend-config.js)) to
* change the project title,
* adjust colors,
* customize texts and
* configure your statuses.

Do not:
* remove lines from the file
* change the values of ```useBackendMock```, ```backendRESTRoute``` or ```backendWebSocketURL```

#### Attribute Configuration

Adjust the display attribute config file ([```/deployment/config/attribute-config.js```](https://github.com/bptlab/wiki-resources/blob/master/argos-deployment/config/attribute-config.js)) file to choose the attributes that should be displayed on the cards in the grid view.
* [Template file schema](https://github.com/bptlab/argos-frontend/wiki/AttributeConfig-Template)
* [Transport for London example](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/config/attribute-config.js)

#### Help Configuration

The help configuration file is located under ([```/deployment/config/help-config.js```](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/config/help-config.js). You can import new help files here for other languages adhering to the existing format. Please also include the new help files in the ```docker-compose.yml``` like the existing ones. New help files must include all keys like the existing help files, e.g. ```help_de.js```.

### Backend, Unicorn and NGINX Configuration

In most of the cases you will not need to change anything inside
* [```/deployment/config/backend-config.properties```](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/config/argos-backend.properties)
* [```/deployment/config/unicorn-config.properties```](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/config/unicorn.properties)
* [```/deployment/config/nginx-config.conf```](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/config/nginx.conf)

Everything should be preconfigured for you.

### Static data

Put your static data inside ```argos-deployment/static_data``` as ```.xml``` files.
* [Template file schema](https://github.com/bptlab/argos-backend/wiki/Static-Data-File-Schema)
* [Transport for London example](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/static_data/tfl_small.xml)

### Basic event types

Put your basic event types inside ```argos-deployment/event_types``` as ```.json``` files.
* [Template file schema](https://github.com/bptlab/argos-backend/wiki/Default-EventType-File-Schema)
* [Transport for London example](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/event_types/EstimatedArrivalChangedEventType.json)
