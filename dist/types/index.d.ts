/// <reference types="react" />
export declare type Store<State> = {
    Provider: (props: {
        children: React.ReactNode;
    }) => JSX.Element;
    useStore: () => [State, React.Dispatch<ActionPayload<any>>, () => void];
};
/** The shape of the React context object that contains the Store's state and dispatch function. */
export declare type StoreContext<State> = {
    state: State | null;
    dispatch: React.Dispatch<ActionPayload<any>>;
};
export declare type CreateStoreOptions = {
    /** Key to use when storing state in local/session storage */
    storageKey?: string;
    /** Storage API to use, if any */
    storageType?: 'local' | 'session';
};
export declare type Reducer<State> = (prevState: State, 
/** Payload generated from calling an Action */
actionPayload: ActionPayload) => State;
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
 * export const { Provider, useStore } = createStore<State>(initialState, actions, options)
 * ```
 */
export declare function createStore<State>(initialState: State, actions: ActionMap, options?: CreateStoreOptions): Store<State>;
