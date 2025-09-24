import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Slice imports
import authSlice from "./slices/auth.slice.js";
import todoSlice from "./slices/todo.slice.js";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const appReducer = combineReducers({
  auth: authSlice,
  todo: todoSlice,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    storage.removeItem("persist:root");
    // storage.removeItem('persist:otherKey')
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export default store;
