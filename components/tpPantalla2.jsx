import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import CustomHeader from "./CustomHeader";

export function MoviesScreen2({ route }) {
  const { movie } = route.params;
  const insets = useSafeAreaInsets();

  if (!movie) {
    return (
      <View style={styles.Container}>
        <Text style={styles.ErrorText}>No se encontró la película.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingHorizontal: 16,
      }}
    >
      <CustomHeader title="PeliculaTp" />
      
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.poster}
        resizeMode="cover"
      />

      <Text style={styles.Title}>{movie.title}</Text>
      <Text style={styles.releaseDate}>{movie.release_date}</Text>
      <Text style={styles.releaseDate}>
        Géneros: {movie.genres?.map((g) => g.name).join(", ")}
      </Text>

      <Text style={styles.overview}>{movie.overview}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  poster: {
    marginTop: 30,
    width: 300,
    height: 450,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  Title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  releaseDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
    textAlign: "center",
  },
  overview: {
    fontSize: 16,
    paddingVertical: 10,
    textAlign: "justify",
  },
  ErrorText: {
    fontSize: 16,
    color: "red",
  },
});
