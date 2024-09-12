import React from 'react';
import Login from './components/Login';
import { auth } from './firebase';

const App = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

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
