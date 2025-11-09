import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function TpPantalla1() {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigation = useNavigation(); // ✅ acceso al navegador

  useEffect(() => {
    const fetchPeliculas = async () => {
      try {
        const res = await axios.get(
          'https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1',
          {
            headers: {
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MDc2MTc2Y2M1YjIzNTU4ZTk1NTE5Mjg4ODUwNjY2YiIsIm5iZiI6MTcxNzcxNzg3OC4xNSwic3ViIjoiNjY2MjRiNzZhNjU4N2E2NmI5M2M3ZThjIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.G3Te8trDYm_2EtECO0gjuU3AxY_Y1SyylIrMIa5EVxo',
              accept: 'application/json',
            },
          }
        );
        setPeliculas(res.data.results);
      } catch (error) {
        console.error('Error al obtener películas:', error);
      } finally {
        setCargando(false);
      }
    };
    fetchPeliculas();
  }, []);

  // 🔴 función de logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@session_user');
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    }
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Cargando películas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔴 Botón de logout */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🎬 Películas Populares</Text>

      <FlatList
        data={peliculas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
              style={styles.poster}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <Text style={styles.rating}>⭐ {item.vote_average.toFixed(1)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
  },
  poster: { width: 80, height: 120, borderRadius: 6, marginRight: 10 },
  movieTitle: { fontSize: 16, fontWeight: '600', flexWrap: 'wrap' },
  rating: { color: '#555', marginTop: 4 },
  logoutButton: {
    backgroundColor: '#e63946',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },
});
