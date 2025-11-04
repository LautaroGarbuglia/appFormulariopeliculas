import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomHeader from '../components/CustomHeader';

export function MoviesScreen({ navigation }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MDc2MTc2Y2M1YjIzNTU4ZTk1NTE5Mjg4ODUwNjY2YiIsIm5iZiI6MTcxNzcxNzg3OC4xNSwic3ViIjoiNjY2MjRiNzZhNjU4N2E2NmI5M2M3ZThjIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.G3Te8trDYm_2EtECO0gjuU3AxY_Y1SyylIrMIa5EVxo'
      }
    };

    fetch('https://api.themoviedb.org/3/movie/671?language=es-ES', options)
      .then(res => res.json())
      .then(res => {
        setMovie(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.Container}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.Container}>
        <Text style={styles.ErrorText}>No se encontró la película.</Text>
      </View>
    );
  }

  return (
    <View style={[{ paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <CustomHeader title="PeliculaTp" />

      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.poster}
      />

      <Text style={styles.Title}>{movie.title}</Text>
      <Text style={styles.tagline}>{movie.tagline}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("tpPantalla2", { movie })}
      >
        <Text style={styles.buttonText}>Ver detalles</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  Title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#1274b6ff',
    marginBottom: 20,
    textAlign: 'center',
  },
  poster: {
    marginTop: 30,
    width: 300,
    height: 450,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ErrorText: {
    fontSize: 16,
    color: "red",
  },
});
