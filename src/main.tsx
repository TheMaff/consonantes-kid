import React from "react";
import ReactDOM from "react-dom/client";


import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./lib/Theme";
import { DataProvider } from "./context/DataContext";  // context for data fetching
import { AuthProvider } from "./context/AuthContext";  // context for authentication
import { LivesProvider } from "./context/LivesContext"; // context for lives management

import { ProgressProvider } from "./context/ProgressContext";
import App from "./App";
import { BadgeProvider } from "./context/BadgeContext";

// const theme = extendTheme({}); // default
console.log("[main] rendering");

ReactDOM.createRoot(document.getElementById("root")!).render(
  
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ProgressProvider>
        <LivesProvider>


        <BrowserRouter>
          <AuthProvider>
            <BadgeProvider>

              <DataProvider>
                <App />
              </DataProvider>
              
            </BadgeProvider>
          </AuthProvider>
        </BrowserRouter>

        </LivesProvider>
      </ProgressProvider>
    </ChakraProvider>
  </React.StrictMode>
);


