import React,{useEffect, useState} from 'react';
import Login from './components/Login';
import { auth } from './firebase';

import {ref, onValue} from 'firebase/database';
import {database} from './firebase';

const App = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
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
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
