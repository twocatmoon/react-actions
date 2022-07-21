import { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import { ActionMap, ActionSetExecute, clearStorage, CreateStoreOptions, Dispatch, Execute, getStorage, makeReducer, Reducer } from '.'

export type CreateStoreContextResult <State> = {
    Provider: (props: { children: React.ReactNode }) => JSX.Element
    useStore: () => [state: State, dispatch: Dispatch, execute: Execute, clearStorage: () => void]
}

/** The shape of the React context object that contains the Store's state and dispatch function. */
export type StoreContext <State> = {
    state: State
    dispatch: Dispatch
    execute: Execute
}

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
export function createStoreContext <State> (initialState: State, actions: ActionMap, options?: CreateStoreOptions): CreateStoreContextResult<State> {
    const [ storageApi, initialStateResult ] = getStorage<State>(options?.storageKey, options?.storageType)

    if (!options?.ssr && initialStateResult) initialState = initialStateResult

    const store = createContext<StoreContext<State>>({
        state: initialState,
        dispatch: null as any,
        execute: null as any
    })

    // Map keys to each Action
    Object
        .entries(actions)
        .forEach(([key, action]) => action.id = key)

    const Provider = (props: { children: React.ReactNode }) => {
        const reducer = makeReducer(actions, storageApi, options?.storageKey)
        const [ state, dispatch ] = useReducer<Reducer<State>>(reducer, initialState)

        const execute = async function <Result> ([executeFn, input]: [ActionSetExecute<State, any, any>, any]): Promise<Result> {
            return await executeFn(dispatch, state, input)
        }

        const isReadyRef = useRef(false)
        useEffect(() => {
            if (!options?.ssr) return
            if (!initialStateResult) return 
            if (isReadyRef.current) return

            isReadyRef.current = true
            dispatch(['__clientReady__', initialStateResult])
        }, [dispatch])

        return (
            <store.Provider value={{ state, dispatch, execute }}>
                {props.children}
            </store.Provider>
        )
    }

    const useStore = () => {
        const { state, dispatch, execute } = useContext(store)

        return [
            state,
            dispatch,
            execute,
            () => clearStorage(storageApi, options?.storageKey),
        ] as [ 
            State, 
            Dispatch,
            Execute,
            () => void,
        ]
    }

    return {
        Provider,
        useStore,
    }
}
