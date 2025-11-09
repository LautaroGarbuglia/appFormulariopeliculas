import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './components/LoginScreen';
import AdminScreen from './components/AdminScreen';
import UserFormScreen from './components/UserFormScreen';
import MoviesScreen from './components/tpPantalla1';
import { ensureAdmin } from './components/database';



const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    (async () => {
      await ensureAdmin();
      const s = await AsyncStorage.getItem('@session_user');
      if (!s) setInitialRoute('Login');
      else {
        const user = JSON.parse(s);
        setInitialRoute(user.rol === 'admin' ? 'Admin' : 'Movies');
      }
    })();
  }, []);

  if (!initialRoute) return null; // pantalla de carga opcional

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Administración' }} />
        <Stack.Screen name="UserForm" component={UserFormScreen} options={{ title: 'Usuario' }} />
        <Stack.Screen name="Movies" component={MoviesScreen} options={{ title: 'Películas' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

