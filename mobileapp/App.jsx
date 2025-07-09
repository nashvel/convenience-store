import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RiderTabNavigator from './src/rider/navigation/RiderTabNavigator';
import LoginScreen from './src/rider/screens/LoginScreen';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email, password) => {
    // Dummy authentication: any email/password will work
    if (email && password) {
      console.log(`Logging in with ${email}`);
      setIsAuthenticated(true);
    }
  };

  return (
    <NavigationContainer>
      {isAuthenticated ? <RiderTabNavigator /> : <LoginScreen onLogin={handleLogin} />}
    </NavigationContainer>
  );
}

export default App;
