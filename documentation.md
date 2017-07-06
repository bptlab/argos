---
layout: page
title: Documentation
permalink: /documentation/
---

## Structure

1. [Installation](#installation)
1. [Configuration](#configuration)

## Installation

### Prerequisites
1. [Docker engine](https://www.docker.com/) - version 1.13.0+
1. [Docker compose](https://docs.docker.com/compose/install/) - version 1.10.0+

### Installation

1. Clone the [argos repository](https://github.com/bptlab/argos).

    ```git clone git@github.com:bptlab/argos.git```
1. (Optional) Switch to another branch containing an example configuration.

    ```git checkout tfl_config_example```
1. Move to the deployment directory.

    ```cd argos/deployment```
1. Configure external host and database name.

    Therefore change the following files according to your needs:
    - ```argos-deployment/deployment-config/host.env```
    - ```argos-deployment/deployment-config/database.env```
1. (Optional) Change other configuration files.

    Refer to [configuration](#configuration) for detailed instructions and configuration possibilities.
1. When finished configuring, run docker-compose.

    ```docker-compose up```


## Configuration

### General

We created 2 example usecases as orientation.
1. Transport for London: ```TfL_usecase_deployment``` branch.
1. BoschTT IoT: ```Bosch_usecase_deployment``` branch.
Application configuration files are located under ```argos-deployment/config```

### Frontend

Inside the frontend configuration file ([```frontend-config.js```](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/config/frontend-config.js)) you can
* change the project title,
* adjust colors,
* customize texts and
* configure your statuses.

Do not:
* remove lines from the file
* change the values of ```useBackendMock```, ```backendRESTRoute``` or ```backendWebSocketURL```

#### Attribute Config

Adjust the display attribute config file ([```attribute-config.js```](https://github.com/bptlab/wiki-resources/blob/master/argos-deployment/config/attribute-config.js)) file to choose the attributes that should be displayed on the cards in the grid view. Write the EntityTypes that you have in your static data (see below) as keys into the config object and specify in their value object the attributes that you want to see in the cards in the grid view.
* [Attribute Config Template](https://github.com/bptlab/argos-frontend/wiki/AttributeConfig-Template)
* [Transport for London Example](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/config/attribute-config.js)

#### Help file

The [Help File](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/config/help-config.js). You can import new help files here for other languages adhering to the existing format. Please also include the new help files in the ```docker-compose.yml``` then like the existing ones. New help files must include all keys like the existing help files, e.g. ```help_de.js```.

### Backend, Unicorn, NGINX

In most of the cases you will not need to change anything inside
* [```argos-backend.properties```](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/config/argos-backend.properties)
* [```unicorn.properties```](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/config/unicorn.properties)
* [```nginx.conf```](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/config/nginx.conf)

Everything should be preconfigured for you.

### Static data

Put your static data inside ```argos-deployment/static_data``` as ```.xml``` files.
* [Template file schema](https://github.com/bptlab/argos-backend/wiki/Static-Data-File-Schema)
* [Transport for London example](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/static_data/tfl_small.xml)

### Basic event types

Put your basic event types inside ```argos-deployment/event_types``` as ```.json``` files.
* [Template file schema](https://github.com/bptlab/argos-backend/wiki/Default-EventType-File-Schema)
* [Transport for London example](https://github.com/bptlab/wiki-resources/blob/TfL_usecase_deployment/argos-deployment/event_types/EstimatedArrivalChangedEventType.json)
