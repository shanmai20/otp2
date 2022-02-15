import React from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import Userdashboard from './pages/Userdashboard';
import { EmailProvider } from "./context/emailContext";

const App = () => {
  return <div>
   < EmailProvider>
<Router>
      <Routes>
       <Route exact path="/"  element= {<Signup/>}/>
       <Route exact path="/Verify"  element= {<Verify/>}/>
       <Route exact path="/Userdashboard"  element= {<Userdashboard/>}/>




       

      </Routes>

      </Router>

  </EmailProvider>


  </div>;
};

export default App;
