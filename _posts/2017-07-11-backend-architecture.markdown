---
layout: post
title:  "Argos Backend - General Structure and Components"
date:   2017-07-11 13:00:00 +0200
categories: argos backend developer documentation
---

## Content

1. [The Argos Philosophy](#the-argos-philosophy)
1. [Architecture](#architecture)
    1. [Storage](#storage)
        1. [DatabaseAccess](#databaseaccessimpl)
        1. [PersistenceAdapter](#persistenceadapterimpl)
        1. [Observable](#observableimpl)
    1. [EventProcessing](#eventprocessing)
        1. [EventCreationObservable](#eventcreationobservable)
        1. [EventMappingObservable](#eventmappingobservable)
        1. [Event Creation](#event-creation)
    1. [EventSubscriber](#eventsubscriber)
    1. [API](#api)
        1. [RestEndpointUtil](#restendpointutilimpl)
    1. [Notifications](#notifications)
        1. [Batching](#notification-batching)
1. [Data Import](#data-import)
    1. [Static Data Files](#static-data-files)
        1. [Event Types](#event-types)
        1. [Product Data](#product-data)
    1. [Configuration](#configuration)


## The Argos Philosophy

The ArgosBackend (**AB**) is a [Java 8](https://www.java.com/en/download/faq/java8.xml) application, which uses [Maven](https://maven.apache.org/) for project management.
It is build to be as flexible as possible, allowing future egineers to extend the functionality. Thus, some critical design decisions will be depicted in the following chapters.

## Architecture

![ArgosBackend Architecture](/argos/resources/backend/argos-backend-architecture.png "ArgosBackend Architecture Overview")

Shown above is the abstract architecture of the AB, as well as the EventProcessingPlatform (**EPP**) and the ArgosFrontend (**AF**). The latter two are not of our interest at this point, therefore they are only shown as black boxes.
The AB consists of five main components.

### Storage

The Storage component is the central point for everything, which must communicate with the database. Thus, there are a lot of methods to create, update, delete and fetch artifacts of all kinds from the database.

![Argos Storage Architecture](/argos/resources/backend/argos-backend-storage-architecture.png "Argos Storage Architecture")

Shown above are the most relevant classes of the Storage component. You will notice, that the only non-abstract implementations are the DatabaseAccessImpl and the PersistenceAdapterImpl. These two take responsibility for any kind of data exchange with the database.

#### DatabaseAccessImpl

The DatabaseAccessImpl implements only a few generic methods, which are very flexible and can be adapted to fit almost every scenario.

For example:
```java
/**
 * This method executes a query in a certain transaction context while a session is
 * open and returns the result or a default value.
 * @param session - the database session, which must be open
 * @param query - the query to execute and to retrieve the results from
 * @param transaction - the current transaction
 * @param getValue - the function to get the results from the query
 * @param defaultValue - a fall back default value in case anything went wrong or no
 * entities were found
 * @param <ResultType> - the result type
 * @param <QueryType> - the query type
 * @return - an object of the result value type
 */
<ResultType, QueryType> ResultType getArtifacts(Session session,
                                                Query<QueryType> query,
                                                Transaction transaction,
                                                Callable<ResultType> getValue,
                                                ResultType defaultValue);
```

Since those methods have very complex signatures, they are not shown completely in the class diagram. Although these methods are too complex for the class diagram, we made sure to write JavaDocs - as shown in the example - for every method in the entire AB. Therefore, you should find some more help when inspecting the actual source code.

#### PersistenceAdapterImpl

The PersistenceAdapterImpl is a singleton wrapper for the DatabaseAccessImpl. It provides a lot of methods for fetching artifacts from the database. Furthermore, it also inherits from the ObservableImpl. This will come into play later on.

Methods offered by the PersistenceAdapterImpl generally look like this:
```java
/**
 * This method returns a eventQuery with given id.
 * @param eventQueryId - the unique identifier of the eventQuery
 * @return - the eventQuery with matching id
 */
EventQuery getEventQuery(long eventQueryId);

/**
 * This method returns a list of events, which belong to a specific eventType.
 * @param eventTypeId - the unique identifier of the eventType
 * @return - a list of events, which belong to a specific eventType
 */
List<Event> getEventsOfEventType(long eventTypeId);
```

They are much easier to use and understand than the generic methods of the DatabaseAccessImpl.
Additionally, since the PersistenceAdapterImpl is implemented using the singleton pattern, you can access the database from any other class in the entire AB.

Besides data fetching, the PersistenceAdapterImpl also offeres method for manipulating artifacts in the database. You get to chose between two different methods:
```java
/**
 * This method saves/updates a list of persistenceArtifacts. Connected web socket
 * clients will *not* be notified.
 * @param artifacts - the artifacts to save/update
 * @return - true, if all artifacts were saved/updated
 */
boolean saveArtifacts(PersistenceArtifact... artifacts);

/**
 * This method saves a new artifact in the database and notifies connected web socket
 * clients.
 * @param artifact - the artifact to save
 * @param fetchUri - the uri, where connected web socket clients can fetch the new
 * artifact from
 * @return - true, if the artifact was stored in the database
 */
boolean createArtifact(PersistenceArtifact artifact, String fetchUri);
```

This redundancy is given for all three main operations:
* Create
* Update
* Delete

The first option is always to just create/update/delete a chunk of artifacts. The latter will only affect one artifact. But - as you might have already read in the JavaDoc - the first method will not send any notifications to the AF while the second option will. Thus, it depends on the situation which option you have to use.

#### ObservableImpl

Speaking of the notifications: This is where the inherited behavior of the ObservableImpl becomes important. Since the PersistenceAdapterImpl is the central point of database communication, it is perfectly suited to trigger web socket notifications. In order to do so, the observer pattern is implemented. This will enable an extensible way of observing the database, which is used by the Notifications component already.

The implementation of this notification trigger will look like this:

```java
/**
 * This interface represents observable objects.
 * @param <Observer> - the observer type
 */
public interface Observable<Observer> {

	/**
	 * This method invokes a method for each observer.
	 * @param notifyMethod - the method to invoke for each observer
	 */
	void notifyObservers(Consumer<Observer> notifyMethod);

    ...
}

/**
 * This class offers methods to retrieve and store artifacts.
 */
public final class PersistenceAdapterImpl
              extends ObservableImpl<PersistenceArtifactUpdateObserver>
              implements PersistenceAdapter {

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean createArtifact(PersistenceArtifact artifact, String fetchUri) {
        if (!saveArtifacts(artifact)) {
        	return false;
        }

        notifyObservers((PersistenceArtifactUpdateObserver observer) ->
        observer.onArtifactUpdated(PersistenceArtifactUpdateType.CREATE,
        artifact, fetchUri));

        return true;
    }

    ...
}
```

When an artifact gets stored, the PersistenceAdapterImpl calls the inherited `notifyObservers` method passing a lambda expression as parameter. This expression will then be executed for each of the registered observers. Thus, every observer will be notified about the data changes.

The Notifications component is also one of the observers. Therefore, it is able to generate a web socket notification, which contains the current change. You will find more information [here](#Notifications).


### EventProcessing

The EventProcessing component consists of different classes. The most relevant ones are shown below:

![ArgosBackend EventProcessing Architecture](/argos/resources/backend/argos-backend-event-processing-architecture.png "ArgosBackend EventProcessing Architecture")

The central class is the EventReceiverImpl. As you can see, it is a RestEndpoint. This is, because events will arrive as POST requests from the EPP. Therefore, the EventReceiverImpl offers a route for exactly these requests.<br>
Additionally, the EventReceiverImpl has two different Observables.

#### EventCreationObservable

The EventCreationObservable accepts EventCreationObservers. These are interested in new events, which are received by the EventReceiverImpl.

---
__Default behavior__:

By default, one instance of the EventEntityMapperImpl class is subscribed to the EventCreationObservable. As the name already suggests, this instance will try to map the received events to an entity in the database. This is done by using the EventEntityMapping - if there is one for the EventType.

__IMPORTANT__:<a name="Important-EventCreationObservable"></a>

The ObserverCallOrder for the EventCreationObservable is set to `LAST_IN_FIRST_OUT`, by default. This means, that every new EventCreationObserver will be called __BEFORE__ the EventEntityMapperImpl is notified. This means, that the default logic of the EventEntityMapperImpl is only exeucted, if - and only if - the received event is not mapped yet.

---
__Custom behavior__:

The implemented observer pattern allows for great flexibility, allowing very easy extensions to the existing architecture.

For an example, lets say, that we want to map every event to a special entity.<br>
Your code could look something like that:
```java
/**
 * Application start method.
 * @param args - command line arguments
 */
public static void main(String[] args) {
	...

    Argos argos = ArgosImpl.run();
    try {
        argos.addEventEntityMapper(new EventCreationObserver() {
            @Override
            public void onEventCreated(EventEntityMappingStatus mappingStatus,
                                        EventType eventType,
                                        List<TypeAttribute> eventTypeAttributes,
                                        Event event,
                                        List<Attribute> eventAttributes) {

                // do not continue, if the event was mapped already
                if (mappingStatus.isMapped()) {
                return;
                }

                // get the special entity we want to map all the events to
                Entity yourSpecialEntity = PersistenceAdapterImpl.getInstance()
                .getEntity(YOUR_ENTITY_ID);

                // set our special entity as owner of the event
                mappingStatus.setEventOwner(yourSpecialEntity);

                // also update the current status of our special entity
                mappingStatus.getStatusUpdateStatus().setNewStatus("YOUR NEW STATUS");
            }
        });
    } catch (ArgosNotRunningException e) {
    	// argos is not running
    }
}
```

The example above shows, how you can add custom mapping and status update logic. All you need is a running Argos instance.

First, we gonna make sure, that the event is not mapped yet. This is very important to prevent unwanted behavior.<br>
Afterwards, we will fetch a special entity from the database using the PersistanceAdapterImpl. After that, we are manipulating the `mappingStatus`, setting the entity to which the received event should belong. Additionally, we are changing the status of the event owner.

This observer will be called whenever a new event was received. Please note, that the default logic will still be executed. This means, that the default mapping is executed if you did not set the event owner yourself.

#### EventMappingObservable

The EventMappingObservable works just like the EventCreationObservable. The only thing that changes is the default behavior and the trigger reason.

For the reason - which should be pretty obvious at this point - we have the mapping of an event. So whenever an event is received and then mapped to a special entity, this Observable will notify all of its observers.

---
__Default behavior__:

By default, one instance of the EntityStatusCalculatorImpl class is subscribed to the EventMappingObservable. This instance will check, whether the status was updated already and - if this is not the case - try to update the status. This update is based on the used EventEntityMapping. If there is no mapping (when you made the mapping yourself for example), the status will not be affected.

__IMPORTANT__:

One again, the ObserverCallOrder of the EventMappingObservable is set to `LAST_IN_FIRST_OUT`, by default. This has the same effect as mentioned [above](#Important-EventCreationObservable).

---
__Custom behavior__:

Following the example for the EventCreationObservable, you can again control the mapping yourself.<br>
Your code could look like this:
```java
/**
 * Application start method.
 * @param args - command line arguments
 */
public static void main(String[] args) {
    ...

    Argos argos = ArgosImpl.run();
    try {
        argos.addEntityStatusCalculator(new EventMappingObserver() {
            @Override
            public void onEventMapped(EventEntityMappingStatus processStatus) {

                // do not continue, if the status was updated already
                if (processStatus.getStatusUpdateStatus().isStatusUpdated()) {
                	return;
                }

                // get the event as well as the event owner
                Event event = processStatus.getEvent();
                Entity eventOwner = processStatus.getEventOwner();

                // how many of these events were already received?
                int numberOfEvents = PersistenceAdapterImpl.getInstance().
                                      getEventCountOfEntity(eventOwner.getId(),
                                      	event.getTypeId());

                // is the amount of events critical already?
                if (numberOfEvents <= NOT_CRITICAL) {
                	processStatus.getStatusUpdateStatus().setNewStatus("NOT CRITICAL");
                } else {
                	processStatus.getStatusUpdateStatus().setNewStatus("CRITICAL");
                }
            }
        });
    } catch (ArgosNotRunningException e) {
    	// argos is not running
    }
}
```

This example depicts the way of add a new EventMappingObserver to the AB.

So what we are doing is quite simple:<br>
First, check whether the status was changed already. If so, do not continue our custom logic.<br>
If not, then get the total amount of events for the event owner and the event type. If the amount is beyond a certain threshold, update the status of the event owner accordingly.

When we made the decision to implement this kind of observer pattern we hoped to create a great interface for future extensions. When looking at the code, it is indeed very simple to change the behavior of the system while also keeping some default logic - just in case.

#### Event Creation

Now, that we have seen two points for future extensions, we want to take a look at the overall process of event creation. The event creation is also part of the EventReceiverImpl and looks like this:
```java
/**
 * This method creates a new event from a given request body.
 * @param requestBody - the request body to parse
 * @param eventType - the eventType of the new event
 */
private void createEvent(String requestBody, EventType eventType);
```

This method is called, whenever a new event was received. What it does is quite a lot:

* Parse the received requestBody

Since the events will be received as JSON, we need to create a Java object from the body.

* Validate the received event

To prevent errors while processing the received event, we need to make sure everything is just fine. Therefore, the EventReceiverImpl will check whether the event contains all the defined attributes. If there is one missing, the attribute will be added with an empty value.

* Notify all the EventCreationObservers

As we have just seen, the mapping of the received events is realized using the EventCreationObservable. Therefore, we need to notify all of its observers.

* Notify all the EventMappingObservers

After all EventCreationObservers have done their job, the event is mapped. If not - because their is no mapping defined for example - the process stops.<br>
Otherwise, the EventMappingObservers are notified to update the status of the event owner.

* Store the event in the database

If everyhing went well up until this point, we want to make sure the event is stored in the database. This will automatically trigger a web socket notification for connected AFs.

### EventSubscriber

![ArgosBackend EventSubscriber Architecture](/argos/resources/backend/argos-backend-event-subscriber-architecture.png "ArgosBackend EventSubscriber Architecture")

The EventSubscriber is an abstraction of the EEP. Therefore, it offers a wide spectrum for event-type and -query creation and modification. Changes made to the event-types and -queries are usually triggered by the AF via [REST API](#api).<br>
Internally, all the EventSubscriber does is to create HTTP requests. These requests are send to the real EEP. The response is processed and forwarded to the initial AF client. A successful request will lead to an update of the database.

While the EventPlatformFeedback(-Impl) is just a data class for forwarding responses to the initial client, the main work is done by the EventPlatformUpdaterImpl. This clas offeres the mentioned methods. Since there is only one EEP for the entire system it is implemented using the singleton design pattern. This will also allow every class in the system to use the EEP for any event-type and -query manipulation.

Methods offered by the EventPlatformUpdaterImpl generally look like this:
```java
/**
 * This method registers a given eventType in the eventProcessingPlatform.
 * @param eventType - the eventType, which should be registered
 * @return - the feedback of the eventProcessingPlatform
 */
EventPlatformFeedback registerEventType(EventType eventType);

/**
 * This method deletes a given eventType in the eventProcessingPlatform.
 * @param eventType - the eventType to be deleted
 * @return - the feedback of the eventProcessingPlatform
 */
EventPlatformFeedback deleteEventType(EventType eventType);
```

These methods are very easy to use - and to understand. Thus, there should be no explanation needed.

### API

![ArgosBackend API Architecture](/argos/resources/backend/argos-backend-api-architecture.png "ArgosBackend API Architecture")

The API package is responsible for accepting and processing REST requests of the AF. <br>
Shown above are the different RestEndpoints of the API package. Each RestEndpoint is responsible for a distinct set of artifacts. Therefore, each RestEndpoint has also its own base route.<br>
The EntityEndpoint for example is accessable under ```/api/entity/...```.

The full documentation for the API can be found [here](https://github.com/bptlab/argos-backend/wiki/Swagger-REST-Documentation) or directly in the Argos repository under ```argos-backend/docu```. An exported HTML version is available under ```argos-backend/src/main/resources/public/docu```.<br>
The documentation is written using [Swagger](https://swagger.io/). You may also import the ```argos-backend/docu/swagger.yaml``` into the [Swagger Editor](http://editor.swagger.io/#/) to edit and preview the REST documentation.

---
#### RestEndpointUtilImpl

![ArgosBackend RestEndpointUtil Architecture](/argos/resources/backend/argos-backend-rest-endpoint-util-architecture.png "ArgosBackend RestEndpointUtil Architecture")

Shown above is a utility class, which combines methods for all kinds of RestEndpoints. Besides very convenient function - like validating certain input types - it offers the ```executeRequest``` method.<br>
The whole signature is shown below:
```java
/**
 * This method executes a route and catching all exceptions for easier logging.
 * @param logger - the logger to use
 * @param request - the spark request
 * @param response - the spark response
 * @param route - the route to execute
 * @return - the response to the request
 */
String executeRequest(Logger logger, Request request, Response response, Route route);
```

This method will execute a given Route (which is a function taking a ```Spark.Request``` and a ```Spark.Response``` as parameters). The required Request and Response are also given into this method and internally forwarded to the called Route. Additionally, the method takes a ```slf4j.Logger``` which is used for logging during the execution (this is, so the logger output will actually show the calling class instead of the RestEndpointUtilImpl). <br>
This method should always be used when processing REST requests, since it will handle exceptions and thus, prevent the backend from unexpected behavior.

The existing RestEndpoints use the RestEndpointUtilImpl during their setup. The code looks like this:
```java
/**
 * This interface represents the endpoint to receive entities.
 */
public class EntityEndpointImpl implements EntityEndpoint {
    ...

    /**
     * This method sets up the rest endpoint.
     * @param sparkService - the spark service to register routes to
     */
    void setup(Service sparkService) {
        sparkService.get(EntityEndpoint.getEntityBaseUri(),
				(Request request, Response response) ->
						endpointUtil.executeRequest(logger, request, response, this::getEntity));

        ...
    }
}
```

The shown ```setup``` method shows the process of creating a REST GET route.<br>
The ```Spark.get``` method taken an URI (in this case ```"/api/entity/{entityId}"``` - ```{entityId}``` is a parameter for the route) and such a function as mentioned earlier (Route). The route in our case is just another lambda function using the RestEndpointUtilImpl instance.<br>
The Route will be called by the Spark framework, whenever the according request is received. Afterwards, the request as well as the response are given to the Route. The Route is then able to manipulate the response (set the response code, set the response text, etc.) and read parameters as well as the body from the request.

### Notifications

![ArgosBackend Notifications Architecture](/argos/resources/backend/argos-backend-notifications-architecture.png "ArgosBackend Notifications Architecture")

The Notifications component is divided in the ClientUpdateService(-Impl) and the PushNotificationClientHandler(-Impl). While the PushNotificationClientHandlerImpl is responsible to accept incoming AF web socket clients, the ClientUpdateServiceImpl takes care of creating web socket notifications.<br>
These notifications are triggered by the [PersistenceAdapterImpl](#observableimpl).

The web socket notifications are just some objects, which get serialized using JSON. There are two different kinds of notifications.

* Basic Notification

These notifications look like this:
```json
{
    "UpdateReason":"CREATE",
    "ArtifactType":"Event",
    "ArtifactId":13,
    "FetchUri":"/api/entity/13"
}
```

* Event Creation Notification

Those notifications are based on the BasicNotifications shown above. Additionally, they contain information about the EventOwner and the EventType. These information are required in the AF for more efficient processing.<br>
EventCreationNotifications look like this:
```json
{
    "UpdateReason":"CREATE",
    "ArtifactType":"Event",
    "ArtifactId":92,
    "FetchUri":"/api/entity/13/eventtype/37/events/false/0/1",
    "EventTypeId":37,
    "EntityId":13
}
```

The shown example will inform all connected AF clients about the arrival of a new event. This event belongs to the Entity with id 13.<br>
This information is used to decide whether to display the new event or not.

---
#### Notification Batching

There are currently two supported batching modes for the web socket notifications.

* Send Immediately

This mode will send every single notification as soon as it is created. <br>
This mode is made for maximal speed. Notifications are send and received as soon as possible. This enables the domain experts to analyze events in near real time.

**IMPORTANT**: This will affect the overall performance of the AB. Since every notification is send individually, there might be a lot of traffic for the web socket connection. Additionally, since the web socket notifications will **not** send all the changed data, the REST API will also have more traffic. Please keep this in mind.

* Batch Notifications

This mode introduces a buffer for the notifications. This buffer will be emptied every few seconds - you can configure the exact amount of time. Additionally, every updated Artifact will only receive one update within the interval. This means, that earlier updates on the same Artifact will be overwritten, as soon as a new update is introduced. This method is still sufficient, since the data are not send over the web socket connection. Thus, the client has to fetch all data from the REST API no matter what. Therefore, it is enough to inform the client about just one change since all the data are fetched completely anyways.

## Data Import

![ArgosBackend FileParsing Architecture](/argos/resources/backend/argos-backend-file-parsing-architecture.png "ArgosBackend FileParsing Architecture")

Now that we have seen the overall communication architecture of the AB, we want to dive into another important topic: The file import.<br>
In general, we distinguish between two different types of files.

### Static Data Files

Static data files are those, which are specific for the implemented use case. These files have to be created by the solution engineer. They contain the basis for any further operations.<br>
Once again, we differentiate between two different types.

---
#### Event Types

The base for all event processing are some basic event-types. These event-types must be deployed in the AB. The default location is under ```argos-backend/src/main/resources/event_types```. Event-types are basically JSON files, which should look like [this](https://github.com/bptlab/argos-backend/wiki/Default-EventType-File-Schema). Besides all of the event-type's attributes, you may define a list of queries for the event-type.

**IMPORTANT**: You can only define **one** event-type per file. This means, that you will need one file for each basic event-type you want to deploy.

![ArgosBackend EventTypeParser Architecture](/argos/resources/backend/argos-backend-event-type-parser-architecture.png "ArgosBackend EventTypeParser Architecture")

The architecture of the EventTypeParser is as simple as effective. It only needs to read all files in the configured directory and parse them. Since the event-types are saved as JSON objects the GSON library is used to convert them into plain Java objects.<br>
The parsing is started by the ArgosImpl:
```java
/**
 * This class represents the argos backend application.
 */
public class ArgosImpl implements Argos {
    ...

    /**
     * This method starts the argos backend.
     */
    public void start() {
        // read all event-type
        EventTypeParserImpl.getInstance().loadEventTypes();

        ...

        // register all event-types and -queries at the EEP
        EventProcessingPlatformUpdaterImpl.getInstance().setup(this);
    }
}
```

The displayed code snippet shows, how the AB starts. It depicts how the parsing process for the event-types is started. Afterwards, the EEP is notified about all event-types and their associated queries. Thus, the AB and the EEP will be synchronized after the start method is finished.

---
#### Product Data

An other type of static data are the product data. These are given as XML files. By default the files are located under ```argos-backend/src/main/resources/static_data```. The expected format for those files can be found [here](https://github.com/bptlab/argos-backend/wiki/Static-Data-File-Schema).

Those files consist of two sections:
* EntityTypes

The first section describes the general hierarchy for the products (entities).

![ArgosBackend EntityType Hierarchy](/argos/resources/backend/argos-backend-type-hierarchy.png "ArgosBackend EntityType Hierarchy")

Shown above is an example for such a hierarchy.<br>
This hierarchy in our XML format would look like this:
```xml
<staticData>
    <types>
        <type>
            <name>SuperTypeA</name>
            <attributes>
                <attribute>
                    <name>attributeA1</name>
                </attribute>
                <attribute>
                    <name>attributeA2</name>
                </attribute>
            </attributes>
            <childTypes>
                <type>
                    <name>SubTypeA</name>
                    <attributes>
                        <attribute>
                            <name>attributeSA1</name>
                        </attribute>
                        <attribute>
                            <name>attributeSA2</name>
                        </attribute>
                        <attribute>
                            <name>attributeSA3</name>
                        </attribute>
                    </attributes>
                </type>
                <type>
                    <name>SubTypeB</name>
                    <attributes>
                        <attribute>
                            <name>attributeSB1</name>
                        </attribute>
                        <attribute>
                            <name>attributeSB2</name>
                        </attribute>
                    </attributes>
                </type>
            </childTypes>
        </type>
    </types>
</staticData>
```

As you can see, the type hierarchy is defined pretty straight forward. Additionally, we left enough space to expand the file format. If needed, you could easily add the attribute type - such as int, long, String - for each entry.

* Entities

The second section of the static product data is the actual entity hierarchy. This is very similar to the previous section.

For an example please refer to the [file scheme documentation](https://github.com/bptlab/argos-backend/wiki/Static-Data-File-Schema).

Now that we know the file scheme, we can look into the code to understand how those files are converted and finally stored in the database.

![ArgosBackend StaticData Parsing](/argos/resources/backend/argos-backend-static-data-parsing.png "ArgosBackend StaticData Parsing")

Shown above is the simplified structure of the parser architecture. The general idea of this architecture is to match the nested structure of the data. This is realized by nesting XMLSubParsers into the StaticDataParserImpl. The exact XMLSubParser hereby depends on the current context. Thus, parsing an entity will require an other parser than parsing an entity-type.<br>
This architecture allows for a better division of responsibilities and creates more readable code. The only drawback is the more complex structure. We decided, that this tradeoff was worth the better code quality.

For a more details please refer directly to the code. It is - as always in the AB - documented.

### Configuration

The AB can be configured in many ways. This is done by manipulating the ```argos-backend/src/main/resources/argos-backend.properties``` file.

![ArgosBackend PropertyEditor Architecture](/argos/resources/backend/argos-backend-property-editor-architecture.png "ArgosBackend PropertyEditor Architecture")

The properties are managed by the PropertyEditorImpl. This is implemented as a singleton, since the entire system should have access to the properties. You can not only get the pre-defined properties from the mentioned file, but also manipulate properties at execution time. Additionally, you can use the property-keys as arguments when starting the AB.<br>
**IMPORTANT**: Manipulated properties will **not** be persisted to the properties-file.

Within the file you will find various sections with different configuration possibilities.<br>
While most properties should be easy to understand, the most important once are listed below:

* argosBackendExternalHost

This property will define, where the AB is reachable. Thus, it defines where the EEP sends event notifications. <br>
This becomes important, when the EEP and the AB are **not** deployed on the same machine.

* argosBackendEventTypesDirectory / argosBackendStaticDataDirectory

These two properties define where the AB will search for the [static data](#static-data-files).<br>
**IMPORTANT**: You have to give the full path to the files. If you are operating a Windows machine, please define the path like this: ```/C:/Users/YourNameHere/BPT/static_data```.
