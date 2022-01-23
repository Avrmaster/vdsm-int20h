import * as React from "react";
import { Routes, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';

import Home from './Home'

const Meeting = React.lazy(() => import("./Meeting"));

function App() {
  return (
    <>
    <CssBaseline />
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meeting/:roomName" element={
          <React.Suspense fallback={<>Loading</>}>
            <Meeting />
          </React.Suspense>} />
      </Routes>
    </div>
    </>
  );
}

export default App;
