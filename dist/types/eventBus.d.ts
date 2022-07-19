import { ActionMap, CreateStoreOptions, Dispatch, Execute } from '.';
export declare type ListenerMap = {
    [Property in keyof StoreEvents]: ((...args: any[]) => void)[];
};
export declare type StoreEvents = {
    'state_changed': (event: {
        newState: any;
    }) => void;
};
export declare class Store<State> {
    private listeners;
    state: State;
    constructor(initialState: State);
    on<E extends keyof StoreEvents>(event: E, listener: StoreEvents[E]): StoreEvents[E];
    off<E extends keyof StoreEvents>(event: E, listener: StoreEvents[E]): void;
    trigger(event: keyof StoreEvents, data?: any): any[];
}
export declare type CreateStoreEventBusResult<State> = {
    useStore: () => [State, Dispatch, Execute, () => void];
    clientReady: () => void;
};
/**
 * @param {any} initialState - The initial state of the Store
 * @param {ActionMap} actions - The map of Actions to bind to the returned Store
 * @param {CreateStoreOptions} options? - Additional options
 * @returns {Store}
 *
 * @example
 * ```tsx
 * type State = {
 *     counter: number
 * }
 *
 * const initialState = {
 *     counter: 0
 * }
 *
 * const actions = {
 *     ...
 * }
 *
 * const options: CreateStoreOptions = {
 *     storageKey: 'myStore',
 *     storageType: 'local'
 * }
 *
 * export const { useStore } = createStoreEventBus<State>(initialState, actions, options)
 * ```
 */
export declare function createStoreEventBus<State>(initialState: State, actions: ActionMap, options?: CreateStoreOptions): CreateStoreEventBusResult<State>;
