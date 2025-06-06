import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import 'react-quill/dist/quill.snow.css';
import "jsvectormap/dist/css/jsvectormap.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-modal-video/css/modal-video.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from "./config/wagmiConfig"
import { WagmiConfig } from "wagmi"
import { Toaster } from "react-hot-toast";
import { initializeInterceptors, setupApiInterceptors } from "./api/apiClient";
import { PersistGate } from "redux-persist/integration/react";

initializeInterceptors(store, persistor);
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </WagmiConfig>
  </>
);

reportWebVitals();
