import React,{useEffect, useState} from 'react';
import Login from './components/Login';
import { auth } from './firebase';  // Import the auth object
import { getDatabase, ref, set } from 'firebase/database';  // Import necessary functions
import axios from 'axios';

import {onValue} from 'firebase/database';
import {database} from './firebase';

const App = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const database = getDatabase();
        const userRef = ref(database, `Users/${currentUser.uid}`);
        set(userRef, {
          displayName: currentUser.displayName,
          email: currentUser.email,
        }).catch((error) => {
          console.error('Error writing user data:', error);
        });

        axios.post('http://localhost:5000/store_user_id', {
          userId: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email
        })
        .then(response => {
          console.log('User ID sent to backend:', response.data);
        })
        .catch(error => {
          console.error('Error sending user ID to backend:', error);
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
