import React from 'react';
import { Scene } from './components/Scene';
import { Controls } from './components/Controls';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="app">
        <Scene />
        <Controls />
      </div>
    </AppProvider>
  );
}

export default App;
