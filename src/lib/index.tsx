export * from './context'
export * from './eventBus'

export type CreateStoreOptions = {
    /** Key to use when storing state in local/session storage */
    storageKey?: string,
    /** Storage API to use, if any */
    storageType?: 'local' | 'session'
    /** Enable support for server-side rendering */
    ssr?: boolean
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

/** Used internally to generate the reducer for the different Stores */
export function makeReducer <State> (actions: ActionMap, storageApi: Storage | undefined, storageKey: CreateStoreOptions['storageKey']
) {
    return function (state: State, payload: ActionPayload<any>) {
        const [ actionId, data ] = payload
        const action = actions[actionId]
    
        if (!action) {
            throw new Error(`Action with ID '${actionId}' does not exist for this Store.`)
        }
    
        const result = action.resolve(state, data)
        
        if (storageApi && storageKey) {
            storageApi.setItem(storageKey, JSON.stringify(result))
        }
        
        return result
    }
}

/** Used internally to retrieve the storage API and initial state */
export function getStorage <State> (storageKey: CreateStoreOptions['storageKey'], storageType: CreateStoreOptions['storageType']): [Storage | undefined, State | undefined] {
    let storageApi: Storage | undefined
    let initialState: State | undefined

    if (typeof window !== 'undefined' && storageKey && storageType) {
        storageApi = storageType === 'local'
            ? localStorage
            : sessionStorage
    }

    if (storageApi) {
        try {
            const storedStateData = storageApi.getItem(storageKey!)
            if (storedStateData !== null) {
                initialState = JSON.parse(storedStateData)
            }
        } catch {
            throw new Error('Unable to parse stored data for store.')
        }
    }

    return [ storageApi, initialState ]
}

/** Used internally to clear the cached state */
export function clearStorage (storageApi: Storage | undefined, storageKey: CreateStoreOptions['storageKey']) {
    if (storageApi && storageKey) {
        storageApi.removeItem(storageKey)
    } else {
        throw new Error('Unable to clear storage; no storage options set.')
    }
}
