/// <reference types="react" />
import { ActionMap, CreateStoreOptions, Dispatch, Execute } from '.';
export declare type CreateStoreContextResult<State> = {
    Provider: (props: {
        children: React.ReactNode;
    }) => JSX.Element;
    useStore: () => [state: State, dispatch: Dispatch, execute: Execute, clearStorage: () => void];
};
/** The shape of the React context object that contains the Store's state and dispatch function. */
export declare type StoreContext<State> = {
    state: State;
    dispatch: Dispatch;
    execute: Execute;
};
/**
 * @param {any} initialState - The initial state of the Store
 * @param {ActionMap} actions - The map of Actions to bind to the returned Store
 * @param {CreateStoreOptions} options? - Additional options
 * @returns {CreateStoreContextResult}
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
 * export const { Provider, useStore } = createStoreContext<State>(initialState, actions, options)
 * ```
 */
export declare function createStoreContext<State>(initialState: State, actions: ActionMap, options?: CreateStoreOptions): CreateStoreContextResult<State>;
