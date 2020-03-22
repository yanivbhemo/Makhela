import React from 'react';
import makhelogo from './logo-rtl.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import MoDSpecialist from './components/MoDSpecialist'
import SuggestedLeader from './components/SuggestedLeader'

import './App.css';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={makhelogo} alt="makhela" />
        <p>
          MAKHELA
        </p>
        <Button>MOD Specialist</Button>
        <Button>MOD Analyst</Button>
        <Button>Head of Intelligence</Button>
      </header> */}
      <body>
        <SuggestedLeader/>
      </body>
    </div>
  );
}

export default App;
