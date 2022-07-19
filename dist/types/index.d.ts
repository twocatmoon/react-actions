export * from './context';
export * from './eventBus';
export declare type CreateStoreOptions = {
    /** Key to use when storing state in local/session storage */
    storageKey?: string;
    /** Storage API to use, if any */
    storageType?: 'local' | 'session';
    /** Enable support for server-side rendering */
    ssr?: boolean;
};
export declare type Reducer<State> = (prevState: State, 
/** Payload generated from calling an Action */
actionPayload: ActionPayload) => State;
export declare type Dispatch<Payload = any> = (payload: ActionPayload<Payload>) => void;
export declare type Execute = (actionSetPayload: [ActionSetExecute<any, any, any>, any]) => void;
export declare type ActionPayload<Input = any> = [
    actionId: string,
    data: Input
];
export declare type ActionMap = {
    /** A collection of Actions with human-readable keys */
    [key: string]: Action<any, any>;
};
export declare type Action<State, Input> = {
    /** Called internally by the Store to resolve action state */
    (...args: (Input extends undefined ? [data?: undefined] : [data: Input])): ActionPayload<Input>;
    /** Unique ID for each action. Automatically assigned based on key names from the ActionMap passed into createStore  */
    id: string;
    /** User-defined resolver function for the action */
    resolve: (state: State, data: Input) => State;
};
export declare type ActionSetMap = {
    /** A collection of ActionsSets with human-readable keys */
    [key: string]: ActionSet<any, any, any>;
};
export declare type ActionSetExecute<State, Input, Result> = (dispatch: Dispatch, state: State, data: Input) => Promise<Result>;
export declare type ActionSet<State = any, Input = any, Result = void> = (data?: Input) => [ActionSetExecute<State, Input, Result>, Input];
/**
 * Generates an Action object, which when passed into createStore as part of an ActionMap, can be called to mutate the Store's state.
 *
 * @param {Action<State, Input>['resolve']} resolver - The resolver function to be called by the Store's reducer. This function takes in user-input, and should return the modified state. This function can be thought of as a single case in a switch statement as you'd see in Redux or useReducer
 * @returns {any} - The modified full state of the Store
 *
 * @example
 * ```tsx
 * // store.ts
 *
 * const actions = {
 *     incrementCounter: action<State, number>((prevState, amount) => {
 *         return {
 *             ...prevState,
 *             counter: prevState.counter + amount
 *         }
 *     })
 * }
 *
 * ...
 *
 * // Component.tsx
 *
 * function Component () {
 *     const [ state, dispatch ] = useStore()
 *     dispatch(actions.incrementCounter(2))
 *
 *     ...
 * }
 * ```
 */
export declare function action<State, Input>(resolver: Action<State, Input>['resolve']): Action<State, Input>;
/**
 * Generates an ActionSet object, which can be used to execute asynchronous functions and dispatch Actions to the store.
 *
 * @param {ActionSetExecute <State, Input, Result>} execute - Async function to execute
 * @returns {any} - Optionally returns the Result
 *
 * @example
 * ```tsx
 * // store.ts
 *
 * const actionSets = {
 *     fetchCounterData: actionSet<State, number>(async (dispatch, state, input) => {
 *         const nextValue = await fetch(`/api/counter/${input}`)
 *         dispatch(actions.incrementCounter(nextValue))
 *     })
 * }
 *
 * ...
 *
 * // Component.tsx
 *
 * function Component () {
 *     const [ state, dispatch, execute ] = useStore()
 *     execute(actionSets.fetchCounterData(2))
 *
 *     ...
 * }
 * ```
 */
export declare function actionSet<State, Input = any, Result = void>(execute: ActionSetExecute<State, Input, Result>): ActionSet<State, Input, Result>;
/** Used internally to generate the reducer for the different Stores */
export declare function makeReducer<State>(actions: ActionMap, storageApi: Storage | undefined, storageKey: CreateStoreOptions['storageKey']): (state: State, payload: ActionPayload<any>) => any;
/** Used internally to retrieve the storage API and initial state */
export declare function getStorage<State>(storageKey: CreateStoreOptions['storageKey'], storageType: CreateStoreOptions['storageType']): [Storage | undefined, State | undefined];
/** Used internally to clear the cached state */
export declare function clearStorage(storageApi: Storage | undefined, storageKey: CreateStoreOptions['storageKey']): void;
