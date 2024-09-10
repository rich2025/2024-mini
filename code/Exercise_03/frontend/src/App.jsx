import { useState } from 'react'
import './App.css'
import LoginButton from "./components/login";
import LogoutButton from "./components/logout";
import { useEffect } from 'react';
import { gapi } from 'gapi-script';

const clientId = "819894863579-nlh5evpomia8q6h7mn1h2j5m1ocpetl7.apps.googleusercontent.com";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: 'profile email'
      }).then(() => {
        const auth = gapi.auth2.getAuthInstance();
        setIsSignedIn(auth.isSignedIn.get());
        auth.isSignedIn.listen(setIsSignedIn);
      }).catch(error => {
        console.error("Error initializing gapi:", error);
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  return (
    <>
      <div>
      <h1>Response Time Game</h1>
      {!isSignedIn ? <LoginButton /> : <LogoutButton />}
   
      </div>
      
    </>
  )
}

export default App
