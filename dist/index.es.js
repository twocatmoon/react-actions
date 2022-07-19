var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import require$$0, { createContext, useReducer, useContext, useState, useEffect } from "react";
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
function toObject(val) {
  if (val === null || val === void 0) {
    throw new TypeError("Object.assign cannot be called with null or undefined");
  }
  return Object(val);
}
function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    }
    var test1 = new String("abc");
    test1[5] = "de";
    if (Object.getOwnPropertyNames(test1)[0] === "5") {
      return false;
    }
    var test2 = {};
    for (var i = 0; i < 10; i++) {
      test2["_" + String.fromCharCode(i)] = i;
    }
    var order2 = Object.getOwnPropertyNames(test2).map(function(n2) {
      return test2[n2];
    });
    if (order2.join("") !== "0123456789") {
      return false;
    }
    var test3 = {};
    "abcdefghijklmnopqrst".split("").forEach(function(letter) {
      test3[letter] = letter;
    });
    if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}
shouldUseNative() ? Object.assign : function(target, source) {
  var from;
  var to = toObject(target);
  var symbols;
  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);
    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);
      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }
  return to;
};
/** @license React v17.0.2
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = require$$0, g = 60103;
reactJsxRuntime_production_min.Fragment = 60107;
if (typeof Symbol === "function" && Symbol.for) {
  var h = Symbol.for;
  g = h("react.element");
  reactJsxRuntime_production_min.Fragment = h("react.fragment");
}
var m = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, n = Object.prototype.hasOwnProperty, p = { key: true, ref: true, __self: true, __source: true };
function q(c, a, k) {
  var b, d = {}, e = null, l = null;
  k !== void 0 && (e = "" + k);
  a.key !== void 0 && (e = "" + a.key);
  a.ref !== void 0 && (l = a.ref);
  for (b in a)
    n.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps)
    for (b in a = c.defaultProps, a)
      d[b] === void 0 && (d[b] = a[b]);
  return { $$typeof: g, type: c, key: e, ref: l, props: d, _owner: m.current };
}
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
    const execute = async function([executeFn, input]) {
      return await executeFn(dispatch, state, input);
    };
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
