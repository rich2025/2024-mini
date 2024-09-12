import React from 'react';
import { auth, provider, signInWithPopup, signOut } from '../firebase';

const Login = () => {  // login component for Google Auth login as pop-up for firebase
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User info:', user);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
