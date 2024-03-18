import './App.css';
import { useState } from 'react';
import PersonaCanvas from './components/PersonaCanvas';


const DEFAULT_TEXT = `你好世界!
Tech
Otaku
Save
The
World`


function App() {
  let [inputContent, setInputContent] = useState(DEFAULT_TEXT);

  let TextInputEvent = (e) => {
    setInputContent(e.target.value) 
  }

  return (
    <div className="App">
      <textarea rows="10" cols="50" value={inputContent} onChange={(e)=>TextInputEvent(e)} ></textarea>
      <PersonaCanvas content={inputContent} />
    </div>
  );
}

export default App;
