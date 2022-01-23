import * as React from "react";
import { Routes, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Home from './Home'

const Meeting = React.lazy(() => import("./Meeting"));

function App() {
  return (
    <>
    <CssBaseline />
    <ToastContainer/>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meeting/:alias" element={
          <React.Suspense fallback={<>Loading</>}>
            <Meeting />
          </React.Suspense>} />
        <Route path="/meeting" element={
          <React.Suspense fallback={<>Loading</>}>
            <Meeting />
          </React.Suspense>} />
      </Routes>
    </div>
    </>
  );
}

export default App;
