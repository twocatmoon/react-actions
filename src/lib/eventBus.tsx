import { useEffect, useState } from 'react'
import { ActionMap, ActionPayload, ActionSet, ActionSetExecute, clearStorage, CreateStoreOptions, Dispatch, Execute, getStorage, makeReducer } from '.'

export type ListenerMap = {
    [Property in keyof StoreEvents]: ((...args: any[]) => void)[]
}

export type StoreEvents = {
    'state_changed': (event: { newState: any }) => void
}

export class Store<State> {
    private listeners: ListenerMap = {} as ListenerMap
    state: State

    constructor (initialState: State) {
        this.state = initialState
    }

    on <E extends keyof StoreEvents> (event: E, listener: StoreEvents[E]) {
        const listeners = this.listeners[event] || []
        listeners.push(listener)
        this.listeners[event] = listeners as ListenerMap[E]

        return listener
    }

    off <E extends keyof StoreEvents> (event: E, listener: StoreEvents[E]) {
        const listeners = this.listeners[event] || []
        const index = listeners.indexOf(listener)
        listeners.splice(index, 1)
        this.listeners[event] = listeners as ListenerMap[E]
    }

    trigger (event: keyof StoreEvents, data?: any): any[] {
        const listeners = this.listeners[event] || []
        return listeners.map((listener) => listener(data))
    }
}

export type CreateStoreEventBusResult <State> = {
    useStore: () => [State, Dispatch, Execute, () => void]
    clientReady: () => void
}

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
export function createStoreEventBus <State> (initialState: State, actions: ActionMap, options?: CreateStoreOptions): CreateStoreEventBusResult<State> {
    const [ storageApi, initialStateResult ] = getStorage<State>(options?.storageKey, options?.storageType)

    if (!options?.ssr && initialStateResult) initialState = initialStateResult

    const store = new Store(initialState)

    // Map keys to each Action
    Object
        .entries(actions)
        .forEach(([key, action]) => action.id = key)

    const reducer = makeReducer(actions, storageApi, options?.storageKey)

    const dispatch: Dispatch = (payload: ActionPayload<any>) => {
        const newState = reducer(store.state, payload)
        store.state = newState
        store.trigger('state_changed', { newState })
    }

    const useStore = () => {
        const [ state, setState ] = useState(store.state)

        const execute = async function <Result> ([executeFn, input]: [ActionSetExecute<State, any, any>, any]): Promise<Result> {
            return await executeFn(dispatch, state, input)
        }

        useEffect(() => {
            const stateChangedListener = store.on(
                'state_changed', 
                ({ newState }) => setState(newState)
            )

            return () => {
                store.off('state_changed', stateChangedListener)
            }
        }, [])

        return [
            state,
            dispatch,
            execute,
            () => clearStorage(storageApi, options?.storageKey)
        ] as [ 
            State, 
            Dispatch, 
            Execute,
            () => void
        ]
    }

    /** Call this when the client has finished hydrating, eg. inside of a useEffect */
    const clientReady = () => {
        if (!options?.ssr) return
        if (!initialStateResult) return 
        
        store.state = initialStateResult
        store.trigger('state_changed', { newState: initialStateResult })
    }

    return {
        useStore,
        clientReady,
    }
}
