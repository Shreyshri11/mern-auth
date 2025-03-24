/* eslint-disable no-unused-vars */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
    //in order to store the user information in the local storage of the browser so that it remain signed-in
    <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
        <App />
        </PersistGate>
    </Provider>
);
