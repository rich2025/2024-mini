import React,{useEffect, useState} from 'react';
import Login from './components/Login';
import { auth } from './firebase'; 
import { getDatabase, ref, set } from 'firebase/database'; 
import axios from 'axios';

import {onValue} from 'firebase/database';
import {database} from './firebase';

const App = () => {
  const [user, setUser] = React.useState(null);

  // with reference to https://medium.com/@balogunkehinde3/implementing-user-authentication-with-firebase-and-reactjs-c2aa75458d3c

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      
      // if user is logged in, fetch user data for authentication
      if (currentUser) {
        const database = getDatabase();
        const userRef = ref(database, `Users/${currentUser.uid}`);
        set(userRef, {
          displayName: currentUser.displayName,
          email: currentUser.email,
        }).catch((error) => {
          console.error('Error writing user data:', error);
        });

        // send data to local server to be read from backend
        axios.post('http://localhost:5000/store_user_id', {
          userId: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  //main changes start here --------------------------
  //data variable (used to display to website)
  const [data,setDat] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      //sets the id to the userid member of current user might change later
      const userId = auth.currentUser.uid;

      //might need to change 'data' to the specific entry wanted
      const dataRef = ref(database, `users/${userId}/data`);

      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        setData(data);
      }, {
        onlyOnce: true //fetches only once per mount (maybee delete this later)
      });

    };
    fetchData();
  },[]);
  //----------------------------------------------
  // end here

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      {user ? ( // if logged in, show current user's name and logout button
        <div style={{ textAlign: 'center' }}>
          <h1>Welcome, {user.displayName}</h1>
          <h1>{user.uid}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
