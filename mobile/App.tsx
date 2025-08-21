/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { AppNavigation } from './src/navigation';
import { AppProvider } from './src/context/AppContext';
import { AuthProvider } from './src/context/AuthContext';



function App(): React.JSX.Element {

  return (
    <>
      <AuthProvider>
        <AppProvider>
          <AppNavigation />
        </AppProvider>
      </AuthProvider>
    </>
  );
}

export default App;
