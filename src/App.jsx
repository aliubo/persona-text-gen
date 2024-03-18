import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import PersonaCanvas from './components/PersonaCanvas';

function App() {
  let [inputContent, setInputContent] = useState('')

  let TextInputEvent = (e) => {
    setInputContent(e.target.value) 
  }

  return (
    <div className="App">
      <textarea name="" id="" cols="30" rows="10" onChange={(e)=>TextInputEvent(e)} ></textarea>
      <PersonaCanvas content={inputContent} />
    </div>
  );
}

export default App;
