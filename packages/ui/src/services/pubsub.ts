export class EventEmitter implements IEventEmitter {
  private eventMap: Map<string, EventCallback[]>;

  public constructor() {
    this.eventMap = new Map<string, EventCallback[]>();
  }

  /**
   * Remove callback from a specific event list
   * @param eventName - The name of the event list where to remove the callback
   * @param callback - The callback function to be removed
   */
  public remove(eventName: string, callback: EventCallback): void {
    const eventCallbacks = this.eventMap.get(eventName);
    if (eventCallbacks) {
      // Remove the specified callback from the event's callback array
      this.eventMap.set(
        eventName,
        eventCallbacks.filter((cb) => cb !== callback),
      );
    }
  }

  /**
   * Add a callback to be called when a specific event is called
   * @param eventName - The name of the event list to add a callback to
   * @param callback - The callback to be added to the list
   */
  public listen(eventName: string, callback: EventCallback): void {
    if (!this.eventMap.has(eventName)) {
      // If the event doesn't exist in the map, create a new array for it
      this.eventMap.set(eventName, []);
    }
    // Add the callback to the event's callback array
    this.eventMap.get(eventName)?.push(callback);
  }

  /**
   * Calls all callbacks of the event with the given data
   * @param eventName - The name of the event containing callbacks to be called
   * @param data - The data to be dispatched to the callbacks
   */
  public dispatch(eventName: string, data: any): void {
    const eventCallbacks = this.eventMap.get(eventName);
    if (eventCallbacks) {
      // Call each callback of the event with the provided data
      eventCallbacks.forEach((callback) => callback({ payload: data }));
    }
  }
}

export class PubSubService implements IEventEmitter {
  private static instance: PubSubService;

  private eventEmitter: EventEmitter;

  private constructor() {
    this.eventEmitter = new EventEmitter();
  }

  /**
   * Remove callback from the event emitter
   * @param eventName - The name of the event where the callback is removed
   * @param callback - The callback function to be removed
   */
  public remove(eventName: string, callback: EventCallback): void {
    this.eventEmitter.remove(eventName, callback);
  }

  /**
   * Add callback to the event emitter
   * @param eventName - The name of the event to listen to
   * @param callback - The callback to be added to the listener list
   */
  public listen(eventName: string, callback: EventCallback): void {
    this.eventEmitter.listen(eventName, callback);
  }

  /**
   * Dispatch data to event listeners
   * @param eventName - The name of the event to dispatch to
   * @param data - The data to dispatch
   */
  public dispatch(eventName: string, data: any): void {
    this.eventEmitter.dispatch(eventName, data);
  }

  /**
   * Implements a singleton getInstance function for the class
   */
  public static getInstance(): PubSubService {
    if (!PubSubService.instance) {
      // If the instance does not exist, create a new one
      PubSubService.instance = new PubSubService();
    }
    // Return the existing instance
    return PubSubService.instance;
  }
}

export const PubSub = PubSubService.getInstance();

/** Type definitions */
interface IEventEmitter {
  /** Add a callback to be called when a specific event is called */
  listen(eventName: string, callback: EventCallback): void;
  /** Calls all callbacks of the event with the given data */
  dispatch(eventName: string, data: any): void;
  /** Remove a callback from a specific event list */
  remove(eventName: string, callback: EventCallback): void;
}

type EventCallback = (data: EventCapsule) => void;

export interface EventCapsule {
  /** Data dispatched from the event emitter */
  payload: any;
}
