import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { findUserByCredentials, ensureAdmin } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    ensureAdmin(); // crea admin si no existe
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor completá todos los campos');
      return;
    }
    const user = await findUserByCredentials(username.trim(), password.trim());
    if (!user) {
      Alert.alert('Error', 'Credenciales incorrectas');
      return;
    }
    await AsyncStorage.setItem('@session_user', JSON.stringify(user));
    if (user.rol === 'admin') navigation.reset({ index: 0, routes: [{ name: 'Admin' }] });
    else navigation.reset({ index: 0, routes: [{ name: 'Movies' }] });
  };

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>
      <Text>Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
      />
      <Text>Contraseña</Text>
      <TextInput
        
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 15 },
  button: { backgroundColor: '#007BFF', borderRadius: 6, padding: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
