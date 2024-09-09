import { useState } from 'react'
import './App.css'
import LoginButton from "./components/login";
import LogoutButton from "./components/logout";
import { useEffect } from 'react';
import { gapi } from 'gapi-script';

const clientId = "819894863579-nlh5evpomia8q6h7mn1h2j5m1ocpetl7.apps.googleusercontent.com";

function App() {
  
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    };
    gapi.load('client:auth2', start);
  })

  return (
    <>
      <div>
      <h1>Response Time Game</h1>
      <LoginButton />
      <LogoutButton />
   
      </div>
      
    </>
  )
}

export default App
