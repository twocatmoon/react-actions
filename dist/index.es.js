var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import require$$0, { createContext, useReducer, useContext, useState, useEffect } from "react";
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  g !== void 0 && (e = "" + g);
  a.key !== void 0 && (e = "" + a.key);
  a.ref !== void 0 && (h = a.ref);
  for (b in a)
    m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps)
    for (b in a = c.defaultProps, a)
      d[b] === void 0 && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
const jsx = jsxRuntime.exports.jsx;
function createStoreContext(initialState, actions, options) {
  const [storageApi, initialStateResult] = getStorage(options == null ? void 0 : options.storageKey, options == null ? void 0 : options.storageType);
  if (initialStateResult)
    initialState = initialStateResult;
  const store = createContext({
    state: initialState || null,
    dispatch: null,
    execute: null
  });
  Object.entries(actions).forEach(([key, action2]) => action2.id = key);
  const Provider = (props) => {
    const reducer = makeReducer(actions, storageApi, options == null ? void 0 : options.storageKey);
    const [state, dispatch] = useReducer(reducer, initialState);
    const execute = async function([executeFn, input]) {
      return await executeFn(dispatch, state, input);
    };
    return /* @__PURE__ */ jsx(store.Provider, {
      value: {
        state,
        dispatch,
        execute
      },
      children: props.children
    });
  };
  const useStore = () => {
    const {
      state,
      dispatch,
      execute
    } = useContext(store);
    return [state, dispatch, execute, () => clearStorage(storageApi, options == null ? void 0 : options.storageKey)];
  };
  return {
    Provider,
    useStore
  };
}
class Store {
  constructor(initialState) {
    __publicField(this, "listeners", {});
    __publicField(this, "state");
    this.state = initialState;
  }
  on(event, listener) {
    const listeners = this.listeners[event] || [];
    listeners.push(listener);
    this.listeners[event] = listeners;
    return listener;
  }
  off(event, listener) {
    const listeners = this.listeners[event] || [];
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
    this.listeners[event] = listeners;
  }
  trigger(event, data) {
    const listeners = this.listeners[event] || [];
    return listeners.map((listener) => listener(data));
  }
}
function createStoreEventBus(initialState, actions, options) {
  const [storageApi, initialStateResult] = getStorage(options == null ? void 0 : options.storageKey, options == null ? void 0 : options.storageType);
  if (!(options == null ? void 0 : options.ssr) && initialStateResult)
    initialState = initialStateResult;
  const store = new Store(initialState);
  Object.entries(actions).forEach(([key, action2]) => action2.id = key);
  const reducer = makeReducer(actions, storageApi, options == null ? void 0 : options.storageKey);
  const dispatch = (payload) => {
    const newState = reducer(store.state, payload);
    store.state = newState;
    store.trigger("state_changed", {
      newState
    });
  };
  const useStore = () => {
    const [state, setState] = useState(store.state);
<<<<<<< HEAD
    const execute = async function([executeFn, input]) {
      return await executeFn(dispatch, state, input);
    };
=======
>>>>>>> 8b9ca1db95d9891fa98f679c17266f6ff2adc822
    useEffect(() => {
      const stateChangedListener = store.on("state_changed", ({
        newState
      }) => setState(newState));
      return () => {
        store.off("state_changed", stateChangedListener);
      };
    }, []);
    return [state, dispatch, execute, () => clearStorage(storageApi, options == null ? void 0 : options.storageKey)];
  };
  const clientReady = () => {
    if (!(options == null ? void 0 : options.ssr))
      return;
    if (!initialStateResult)
      return;
    store.state = initialStateResult;
    store.trigger("state_changed", {
      newState: initialStateResult
    });
  };
  return {
    useStore,
    clientReady
  };
}
function action(resolver) {
  function action2(data) {
    return [action2.id, data === void 0 ? null : data];
  }
  action2.id = "";
  action2.resolve = resolver;
  return action2;
}
function actionSet(execute) {
  return function(data) {
    return [execute, data];
  };
}
function makeReducer(actions, storageApi, storageKey) {
  return function(state, payload) {
    const [actionId, data] = payload;
    const action2 = actions[actionId];
    if (!action2) {
      throw new Error(`Action with ID '${actionId}' does not exist for this Store.`);
    }
    const result = action2.resolve(state, data);
    if (storageApi && storageKey) {
      storageApi.setItem(storageKey, JSON.stringify(result));
    }
    return result;
  };
}
function getStorage(storageKey, storageType) {
  let storageApi;
  let initialState;
  if (typeof window !== "undefined" && storageKey && storageType) {
    storageApi = storageType === "local" ? localStorage : sessionStorage;
  }
  if (storageApi) {
    try {
      const storedStateData = storageApi.getItem(storageKey);
      if (storedStateData !== null) {
        initialState = JSON.parse(storedStateData);
      }
    } catch {
      throw new Error("Unable to parse stored data for store.");
    }
  }
  return [storageApi, initialState];
}
function clearStorage(storageApi, storageKey) {
  if (storageApi && storageKey) {
    storageApi.removeItem(storageKey);
  } else {
    throw new Error("Unable to clear storage; no storage options set.");
  }
}
export { Store, action, actionSet, clearStorage, createStoreContext, createStoreEventBus, getStorage, makeReducer };
