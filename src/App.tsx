// import './App.css'
// import { action, createStoreContext, CreateStoreOptions } from './lib'

// /*
//  * Store
//  */

// type State = {
//     foo: string
//     counter: number
// }

// const initialState = {
//     foo: 'bar',
//     counter: 0
// }

// const actions = {
//     fooBarBaz: action<State, undefined>((prevState) => {
//         const nextState = {
//             ...prevState
//         }

//         if (prevState.foo === 'bar') {
//             nextState.foo = 'baz'
//         } else {
//             nextState.foo = 'bar'
//         }

//         return nextState
//     }),

//     incrementCounter: action<State, number>((prevState, amount) => {
//         return {
//             ...prevState,
//             counter: prevState.counter + amount
//         }
//     })
// }

// const options: CreateStoreOptions = {
//     storageKey: 'myStore',
//     storageType: 'local'
// }

// const { Provider, useStore } = createStoreContext<State>(initialState, actions, options)

// /*
//  * App
//  */

// function Consumer () {
//     const [ state, dispatch, clearStorage ] = useStore()

//     return (
//         <div>
//             <p>Foo: <code>{state.foo}</code></p>
//             <p>
//                 <button onClick={() => dispatch(actions.fooBarBaz())}>
//                     Toggle Foo
//                 </button>
//             </p>
//             <p>Counter: <code>{state.counter}</code></p>
//             <p>
//                 <button onClick={() => dispatch(actions.incrementCounter(2))}>
//                     Increment Counter by 2
//                 </button>
//             </p>
//             <p>
//                 <button onClick={() => clearStorage()}>Clear Local Storage</button>
//             </p>
//         </div>
//     )
// }

// function App () {
//     return (
//         <Provider>
//             <div className="App">
//                 <header className="App-header">
//                     <p>React Actions</p>
//                     <Consumer />
//                 </header>
//             </div>
//         </Provider>
//     )
// }

// export default App

import './App.css'
import { action, createStoreEventBus, CreateStoreOptions } from './lib'

/*
 * Store
 */

type State = {
    foo: string
    counter: number
}

const initialState = {
    foo: 'bar',
    counter: 0
}

const actions = {
    fooBarBaz: action<State, undefined>((prevState) => {
        const nextState = {
            ...prevState
        }

        if (prevState.foo === 'bar') {
            nextState.foo = 'baz'
        } else {
            nextState.foo = 'bar'
        }

        return nextState
    }),

    incrementCounter: action<State, number>((prevState, amount) => {
        return {
            ...prevState,
            counter: prevState.counter + amount
        }
    })
}

const options: CreateStoreOptions = {
    storageKey: 'myStore',
    storageType: 'local'
}

const { useStore } = createStoreEventBus<State>(initialState, actions, options)

/*
 * App
 */

function App () {
    const [ state, dispatch, clearStorage ] = useStore()

    return (
        <div>
            <p>Foo: <code>{state.foo}</code></p>
            <p>
                <button onClick={() => dispatch(actions.fooBarBaz())}>
                    Toggle Foo
                </button>
            </p>
            <p>Counter: <code>{state.counter}</code></p>
            <p>
                <button onClick={() => dispatch(actions.incrementCounter(2))}>
                    Increment Counter by 2
                </button>
            </p>
            <p>
                <button onClick={() => clearStorage()}>Clear Local Storage</button>
            </p>
        </div>
    )
}

export default App
