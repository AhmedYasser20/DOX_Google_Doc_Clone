import './index.css'
import LogIn from './views/Login'
import SignUp from './views/Signup'
import Home from './views/Home'
import TextEditor from './views/TextEditor'
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Quill from './Components/CustomizedQuill'

function App() {
  const [isNotFound, setIsNotFound] = useState(false);
  return (
    <Router>
      <div className="App h-screen flex flex-col bg-gray-200 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/texteditor" element={
      
              <TextEditor /> 
             } />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
