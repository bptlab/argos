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
    1. [DatabaseAccess](#databaseaccess)
    2. [PersistenceAdapter](#persistenceadapter)
    3. [Observable](#observable)
  1. [EventProcessing](#eventprocessing)
  1. [EventSubscriber](#eventsubscriber)
  1. [API](#api)
  1. [Notifications](#notifications)
 

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

The EventCreationObservable accepts EventCreationObservers. These are interested in new events, which are received by the EventReceiverImpl. By default, one instance of the EventEntityMapperImpl is subscribed to the EventCreationObservable.

As the name already suggests, this instance will try to map the received event to an entity in the database. This is done by using the EventEntityMapping - if there is one for the EventType.

### EventSubscriber

### API

### Notifications<a name="Notifications"></a>