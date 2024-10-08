// Import React
import React from "react";
// Import the Dashboard component
import Dashboard from "./pages/Dashboard"; // Ensure the path is correct
// Import the CSS file for styling
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        {/* Render the Dashboard component */}
        <Dashboard />
      </div>{" "}
    </ChakraProvider>
  );
}

export default App;
