import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUser, updateUser } from './database';

export default function UserFormScreen({ navigation, route }) {
  const { mode, user } = route.params || {};
  const [correo, setCorreo] = useState(user?.nombre || ''); // usamos "nombre" como "correo"
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState(user?.rol || 'user');

  const handleSave = async () => {
    if (!correo || !username || (!password && mode === 'create')) {
      Alert.alert('Error', 'Completá correo, usuario y contraseña.');
      return;
    }
    try {
      if (mode === 'create') {
        await createUser({ nombre: correo, username, password, rol });
      } else {
        await updateUser({
          id: user.id,
          nombre: correo,
          username,
          password: password || user.password,
          rol,
        });
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message || 'No se pudo guardar el usuario');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}</Text>
        <Text>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />
        <Text>Nombre de usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
        <Text>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder={mode === 'create' ? 'Contraseña' : 'Nueva contraseña (opcional)'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
        <Text>Rol (admin/user)</Text>
      <TextInput
        style={styles.input}
        placeholder="Rol (admin/user)"
        value={rol}
        onChangeText={setRol}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>
          {mode === 'create' ? 'Crear usuario' : 'Guardar cambios'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 },
  btn: { backgroundColor: '#007BFF', padding: 12, borderRadius: 6, alignItems: 'center' },
});
