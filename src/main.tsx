import React from "react";
import ReactDOM from "react-dom/client";


import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./lib/Theme";
import { DataProvider } from "./context/DataContext";  // context for data fetching
import { AuthProvider } from "./context/AuthContext";  // context for authentication

import { ProgressProvider } from "./context/ProgressContext";
import App from "./App";

// const theme = extendTheme({}); // default
console.log("[main] rendering");

ReactDOM.createRoot(document.getElementById("root")!).render(
  
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ProgressProvider>
        <BrowserRouter>
          <AuthProvider>

            <DataProvider>
              <App />
            </DataProvider>

          </AuthProvider>
        </BrowserRouter>
      </ProgressProvider>
    </ChakraProvider>
  </React.StrictMode>
);


