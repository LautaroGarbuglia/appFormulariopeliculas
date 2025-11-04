import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import * as SQLite from 'expo-sqlite';

let db;

export function FormularioScreen() {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [email, setEmail] = useState('');
  const [registros, setRegistros] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        db = await SQLite.openDatabaseAsync('mainDb.db');
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            edad INTEGER,
            email TEXT
          );
        `);
        await getRegistros();
      } catch (error) {
        console.log('Error opening database:', error);
        Alert.alert('Error', 'No se pudo abrir la base de datos.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getRegistros = async () => {
    if (!db) return;
    const result = await db.getAllAsync('SELECT * FROM usuarios ORDER BY id DESC;');
    setRegistros(result);
  };

  const clearForm = () => {
    setNombre('');
    setEdad('');
    setEmail('');
    setEditingId(null);
  };

  const guardarRegistro = async () => {
    if (!nombre.trim() || !edad.trim() || !email.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    try {
      if (editingId) {
        await db.runAsync(
          'UPDATE usuarios SET nombre = ?, edad = ?, email = ? WHERE id = ?;',
          [nombre.trim(), parseInt(edad, 10), email.trim(), editingId]
        );
        Alert.alert('Éxito', 'Registro actualizado.');
      } else {
        await db.runAsync(
          'INSERT INTO usuarios (nombre, edad, email) VALUES (?,?,?);',
          [nombre.trim(), parseInt(edad, 10), email.trim()]
        );
        Alert.alert('Éxito', 'Registro agregado.');
      }
      await getRegistros();
      clearForm();
    } catch (error) {
      console.log('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar el registro.');
    }
  };

  const editarRegistro = (item) => {
    setNombre(item.nombre || '');
    setEdad(item.edad != null ? String(item.edad) : '');
    setEmail(item.email || '');
    setEditingId(item.id);
  };

  const eliminarRegistro = async (id) => {
    Alert.alert('Confirmar', '¿Eliminar este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await db.runAsync('DELETE FROM usuarios WHERE id = ?;', [id]);
            await getRegistros();
          } catch (error) {
            console.log('Error delete:', error);
            Alert.alert('Error', 'No se pudo eliminar el registro.');
          }
        },
      },
    ]);
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>SQLite no está disponible en web</Text>
        <Text style={styles.helper}>
          Ejecuta la app en un emulador o dispositivo (Expo Go) y asegúrate de instalar expo-sqlite.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de Usuarios</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#666"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Edad"
        placeholderTextColor="#666"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={guardarRegistro}>
        <Text style={styles.buttonText}>{editingId ? 'Actualizar' : 'Guardar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearForm}>
        <Text style={styles.buttonText}>Limpiar</Text>
      </TouchableOpacity>

      <ScrollView style={styles.listContainer} contentContainerStyle={{ paddingBottom: 40 }}>
        {registros.length === 0 && !loading ? (
          <Text style={styles.noItems}>No hay registros</Text>
        ) : (
          registros.map((item) => (
            <View key={String(item.id)} style={styles.registroItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.registroText}>Nombre: {item.nombre}</Text>
                <Text style={styles.registroText}>Edad: {item.edad}</Text>
                <Text style={styles.registroText}>Email: {item.email}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.smallButton, styles.editButton]}
                  onPress={() => editarRegistro(item)}
                >
                  <Text style={styles.smallButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.smallButton, styles.deleteButton]}
                  onPress={() => eliminarRegistro(item.id)}
                >
                  <Text style={styles.smallButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0f1636ff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 12, textAlign: 'center' },
  helper: { color: '#FFF', marginTop: 8, textAlign: 'center' },
  input: { backgroundColor: '#FFF', padding: 10, borderRadius: 6, marginBottom: 10, fontSize: 16 },
  button: { backgroundColor: '#6200EE', padding: 12, borderRadius: 6, marginBottom: 10 },
  clearButton: { backgroundColor: '#37474F' },
  buttonText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
  listContainer: { marginTop: 10, flex: 1 },
  registroItem: {
    backgroundColor: '#1a237e',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  registroText: { color: '#FFF', fontSize: 15, marginBottom: 2 },
  actions: { marginLeft: 12, alignItems: 'flex-end' },
  smallButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 4, marginTop: 6 },
  editButton: { backgroundColor: '#FFC107' },
  deleteButton: { backgroundColor: '#F44336' },
  smallButtonText: { color: '#000', fontWeight: '600' },
  noItems: { color: '#FFF', textAlign: 'center', marginTop: 20 },
});

export default FormularioScreen;
