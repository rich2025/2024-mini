import { useState } from 'react'
import './App.css'
import LoginButton from "./components/login";
import LogoutButton from "./components/logout";
import { useEffect } from 'react';
import { gapi } from 'gapi-script';
import { auth, onAuthStateChanged, signInWithCredential, signOut } from './firebase';
import { GoogleAuthProvider } from 'firebase/auth';

const clientId = "819894863579-nlh5evpomia8q6h7mn1h2j5m1ocpetl7.apps.googleusercontent.com";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: 'profile email'
      }).then(() => {
        const auth = gapi.auth2.getAuthInstance();
        setIsSignedIn(auth.isSignedIn.get());
        auth.isSignedIn.listen(setIsSignedIn);
        onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            setUser(firebaseUser);
          } else {
            setUser(null);
          }
        });
      }).catch(error => {
        console.error("Error initializing gapi:", error);
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  const handleLogin = async () => {
    const auth2 = gapi.auth2.getAuthInstance();
    const googleUser = auth2.currentUser.get();
    const id_token = googleUser.getAuthResponse().id_token;
    
    const credential = GoogleAuthProvider.credential(id_token);

    try {
      await signInWithCredential(auth, credential);
    } catch (error) {
      console.error("Error signing in with credential:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
