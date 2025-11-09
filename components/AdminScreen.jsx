import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAllUsers, deleteUser } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUsers();
      loadSession();
    });
    loadUsers();
    loadSession();
    return unsubscribe;
  }, []);

  const loadUsers = async () => {
    const list = await getAllUsers();
    setUsers(list);
  };

  const loadSession = async () => {
    const s = await AsyncStorage.getItem('@session_user');
    setCurrentUser(s ? JSON.parse(s) : null);
  };

  const handleDelete = async (user) => {
    if (currentUser && user.id === currentUser.id) {
      Alert.alert('No permitido', 'No puedes eliminarte a vos mismo.');
      return;
    }
    Alert.alert('Eliminar', `¿Eliminar al usuario ${user.username}?`, [
      { text: 'Cancelar' },
      { text: 'Eliminar', onPress: async () => { await deleteUser(user.id); loadUsers(); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Administración</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('UserForm', { mode: 'create' })}
      >
        <Text style={styles.addText}>+ Nuevo usuario</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.sub}>{item.username} ({item.rol})</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.edit}
                onPress={() => navigation.navigate('UserForm', { mode: 'edit', user: item })}
              >
                <Text>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.delete} onPress={() => handleDelete(item)}>
                <Text style={{ color: '#fff' }}>Borrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Sin usuarios</Text>}
      />

      <TouchableOpacity
        style={styles.logout}
        onPress={async () => {
          await AsyncStorage.removeItem('@session_user');
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }}
      >
        <Text style={{ color: '#fff' }}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
  addButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 10 },
  addText: { color: '#fff' },
  userItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f2f2f2', padding: 10, marginBottom: 8, borderRadius: 6 },
  name: { fontWeight: '700' },
  sub: { color: '#666' },
  actions: { flexDirection: 'row' },
  edit: { marginRight: 8, backgroundColor: '#ffc107', borderRadius: 4, padding: 6 },
  delete: { backgroundColor: '#dc3545', borderRadius: 4, padding: 6 },
  logout: { backgroundColor: '#333', padding: 10, borderRadius: 6, marginTop: 10, alignItems: 'center' },
});
