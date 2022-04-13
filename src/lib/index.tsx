import { createContext, useContext, useReducer } from 'react'

export type Store <State> = {
    Provider: (props: { children: React.ReactNode }) => JSX.Element
    useStore: () => [State, React.Dispatch<ActionPayload<any>>, () => void]
}

/** The shape of the React context object that contains the Store's state and dispatch function. */
export type StoreContext <State> = {
    state: State | null
    dispatch: React.Dispatch<ActionPayload<any>>
}

export type CreateStoreOptions = {
    /** Key to use when storing state in local/session storage */
    storageKey?: string,
    /** Storage API to use, if any */
    storageType?: 'local' | 'session'
}

export type Reducer <State> = (
    prevState: State,
    /** Payload generated from calling an Action */
    actionPayload: ActionPayload
) => State

export type ActionPayload <Input = any> = [
    actionId: string,
    data: Input, 
]

export type ActionMap = {
    /** A collection of Actions with human-readable keys */
    [key: string]: Action<any, any>
}

export type Action <State, Input> = {
    /** Called internally by the Store to resolve action state */
    (...args: (Input extends undefined ? [data?: undefined] : [data: Input])): ActionPayload<Input>
    /** Unique ID for each action. Automatically assigned based on key names from the ActionMap passed into createStore  */
    id: string
    /** User-defined resolver function for the action */
    resolve: (state: State, data: Input) => State
}

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
export function action <State, Input> (resolver: Action<State, Input>['resolve']): Action<State, Input> {
    function action (data?: Input): ActionPayload<Input> {
        return [action.id, (data === undefined ? null : data) as Input]
    }

    action.id = ''
    action.resolve = resolver

    return action as Action<State, Input>
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
 * export const { Provider, useStore } = createStore<State>(initialState, actions, options)
 * ```
 */
export function createStore <State> (initialState: State, actions: ActionMap, options?: CreateStoreOptions): Store<State> {
    let storageApi: Storage | undefined

    if (typeof window !== 'undefined' && options?.storageKey && options?.storageType) {
        storageApi = options.storageType === 'local'
            ? localStorage
            : sessionStorage
    }

    if (storageApi) {
        try {
            const storedStateData = storageApi.getItem(options!.storageKey!)
            if (storedStateData !== null) {
                initialState = JSON.parse(storedStateData)
            }
        } catch {
            throw new Error('Unable to parse stored data for store.')
        }
    }

    const store = createContext<StoreContext<State>>({
        state: initialState || null,
        dispatch: null as any
    })

    // Map keys to each Action
    Object
        .entries(actions)
        .forEach(([key, action]) => action.id = key)

    const Provider = (props: { children: React.ReactNode }) => {
        const [ state, dispatch ] = useReducer<Reducer<State>>((state, payload) => {
            const [ actionId, data ] = payload
            const action = actions[actionId]
    
            if (!action) {
                throw new Error(`Action with ID '${actionId}' does not exist for this Store.`)
            }
    
            const result = action.resolve(state, data)
            
            if (storageApi) {
                storageApi.setItem(options!.storageKey!, JSON.stringify(result))
            }
            
            return result
        }, initialState)

        return (
            <store.Provider value={{ state, dispatch }}>
                {props.children}
            </store.Provider>
        )
    }

    const useStore = () => {
        const { state, dispatch } = useContext(store)

        /** Remove all local/session storage associated with this store. */
        const clearStorage = () => {
            if (storageApi) {
                storageApi.removeItem(options?.storageKey!)
            } else {
                throw new Error('Unable to clear storage; no storage options set.')
            }
        }

        return [
            state,
            dispatch,
            clearStorage
        ] as [ 
            State, 
            React.Dispatch<ActionPayload<any>>, 
            () => void
        ]
    }

    return {
        Provider,
        useStore
    }
}
