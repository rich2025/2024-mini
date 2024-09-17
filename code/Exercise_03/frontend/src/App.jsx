//From React
import React,{useEffect, useState} from 'react';

//For Authentication
import Login from './components/Login';
import { auth } from './firebase';

//For Firebase Realtime Database
import {getDatabase, onValue, ref, set} from 'firebase/database';

//For RESTAPI
import axios from 'axios';

//Web App Start
const App = () => {

  //Instantiate User and Data
  const [user, setUser] = React.useState(null);
  const [data,setData] = useState(null);
  // with reference to https://medium.com/@balogunkehinde3/implementing-user-authentication-with-firebase-and-reactjs-c2aa75458d3c


  React.useEffect(() => {

    //user update
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

        //if there is a user
        if(currentUser){
            const fetchData = () => {
              //sets the id to the userid member of current user
              const userId = auth.currentUser.uid;

              //referencing the userid in the database tree and getting data
              const dataRef = ref(database, `${userId}/Data`);
              onValue(dataRef, (snapshot) => {
                const data = snapshot.val();
                setData(data);
              }, {
                onlyOnce: true //fetches only once per mount
              });


            };
            fetchData();
          //----------------------------------------------
          // end here
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  //main changes start here --------------------------
  //data variable (used to display to website)


  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      {user ? ( // if logged in, show current user's name and logout button
        <div style={{ textAlign: 'center' }}>
          <h1>Welcome, {user.displayName}</h1>
          {data ?(  // if data available, print response time statistics and user id
              <div>
                  <h2>User ID: {data['User ID']}</h2>
                  <h2>Data:</h2>
                  <div>
                    <h3>Minimum Response Time: {data['Minimum Response Time']}</h3>
                    <h3>Maximum Response Time: {data['Maximum Response Time']}</h3>
                    <h3>Average Response Time: {data['Average Response Time']}</h3>
                    <h3>Response Times:</h3>
                    <ol>
                      {data['Response Times'] && data['Response Times'].map((time,index) =>(
                          <li key={index}>{time} ms</li>
                      ))}
                    </ol>
                  </div>
              </div>
          ) : (
              <p>Please Wait: Loading data...</p>
          )}
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
