import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput, Image
} from 'react-native';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import ReproductorScreen from './ReproductorScreen';

const fotoSinValor = require('../assets/foto_artista.png');
const fotoK93 = require('../assets/k93.png');
const fotoSaikoro = require('../assets/saikoro.png');
const imgPlaylist = require('../assets/playlist.jpg');
const imgCarroña = require('../assets/carroña.jpg');
const imgAlbumK93 = require('../assets/albumk93.png');

const generos = [
  { id: '1', nombre: 'INDIE', color: '#2A5A2A' },
  { id: '2', nombre: 'ACID TECHNO', color: '#4A2A1A' },
  { id: '3', nombre: 'BREAKCORE', color: '#1A4A2A' },
  { id: '4', nombre: 'SHOEGAZE', color: '#6A1A1A' },
  { id: '5', nombre: 'POST-PUNK', color: '#5A1A1A' },
  { id: '6', nombre: 'LO-FI', color: '#6A3A8A' },
  { id: '7', nombre: 'GLITCHCORE', color: '#2A2A5A' },
  { id: '8', nombre: 'PHONK', color: '#1A4A4A' },
];

const toquesDestacados = [
  { id: '1', nombre: 'LA BARRA BRAVA', rating: 4.0 },
  { id: '2', nombre: 'CLUB CLANDESTINO', rating: 3.5 },
];

const todasLasCanciones = [
  { id: '1', titulo: 'Consumido', artista: 'SIN VALOR', imagen: imgPlaylist },
  { id: '2', titulo: 'Earrings', artista: 'Malcom Todd', imagen: fotoSaikoro },
  { id: '3', titulo: 'ACÁ EL FRÍO ES PEOR', artista: 'Saikoro!', imagen: fotoSaikoro },
  { id: '4', titulo: 'Void', artista: 'Pouya', imagen: imgPlaylist },
  { id: '5', titulo: 'Marchito', artista: 'SIN VALOR', imagen: imgPlaylist },
  { id: '6', titulo: 'Carroña', artista: 'SIN VALOR', imagen: imgCarroña },
  { id: '7', titulo: 'Ruta 40', artista: 'K93', imagen: imgAlbumK93 },
  { id: '8', titulo: 'Noche Vieja', artista: 'K93', imagen: imgAlbumK93 },
];

const artistas = [
  { id: '1', nombre: 'SIN VALOR', imagen: fotoSinValor, canciones: ['Marchito', 'Carroña', 'Mala Conducta', 'La estructura', '(intro)'] },
  { id: '2', nombre: 'K93', imagen: fotoK93, canciones: ['Ruta 40', 'Noche Vieja', 'El Puente', 'Barrio Sur'] },
  { id: '3', nombre: 'Saikoro!', imagen: fotoSaikoro, canciones: ['Consumido', 'Earrings', 'ACÁ EL FRÍO ES PEOR', 'Void'] },
];

export default function BusquedaScreen({ onClose }) {
  const [query, setQuery] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [cancionActiva, setCancionActiva] = useState(null);

  const artistaEncontrado = artistas.find(a =>
    a.nombre.toLowerCase().includes(query.toLowerCase())
  );

  const cancionesEncontradas = todasLasCanciones.filter(c =>
    c.titulo.toLowerCase().includes(query.toLowerCase()) ||
    c.artista.toLowerCase().includes(query.toLowerCase())
  );

  // ✅ Reproductor
  if (cancionActiva) {
    return (
      <ReproductorScreen
        cancion={cancionActiva}
        onClose={() => setCancionActiva(null)}
      />
    );
  }

  // Estado 3: Resultados
  if (query.length > 0 && !buscando) {
    return (
      <SafeAreaView style={styles.container}>
        <Header onBack={onClose} />
        <View style={[styles.searchBar, styles.searchBarActivo]}>
          <Ionicons name="search-outline" size={18} color={Colors.text} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar..."
            placeholderTextColor={Colors.textMuted}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.seccion}>Resultados a tu búsqueda</Text>

          {artistaEncontrado && (
            <View style={styles.artistaResultado}>
              <Image source={artistaEncontrado.imagen} style={styles.artistaImg} />
              <Text style={styles.artistaNombre}>{artistaEncontrado.nombre}</Text>
            </View>
          )}

          {cancionesEncontradas.map(c => (
            <TouchableOpacity
              key={c.id}
              style={styles.cancionRow}
              activeOpacity={0.7}
              onPress={() => setCancionActiva(c)}
            >
              <Image source={c.imagen} style={styles.cancionImg} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cancionTitulo}>{c.titulo}</Text>
                <Text style={styles.cancionArtista}>{c.artista}</Text>
              </View>
              <Text style={styles.puntos}>⋮</Text>
            </TouchableOpacity>
          ))}

          {!artistaEncontrado && cancionesEncontradas.length === 0 && (
            <Text style={styles.sinResultados}>No se encontraron resultados para "{query}"</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Estado 2: Buscando
  if (buscando) {
    return (
      <SafeAreaView style={styles.container}>
        <Header onBack={onClose} />
        <View style={[styles.searchBar, styles.searchBarActivo]}>
          <Ionicons name="search-outline" size={18} color={Colors.text} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={(t) => { setQuery(t); if (t.length > 0) setBuscando(false); }}
            placeholder="Buscar..."
            placeholderTextColor={Colors.textMuted}
            autoFocus
            onBlur={() => { if (query.length === 0) setBuscando(false); }}
          />
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="mic-outline" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scroll}>
          {todasLasCanciones.map(c => (
            <TouchableOpacity
              key={c.id}
              style={styles.cancionRow}
              activeOpacity={0.7}
              onPress={() => setCancionActiva(c)}
            >
              <Image source={c.imagen} style={styles.cancionImg} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cancionTitulo}>{c.titulo}</Text>
                <Text style={styles.cancionArtista}>{c.artista}</Text>
              </View>
              <Text style={styles.puntos}>⋮</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Estado 1: Pantalla inicial
  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={onClose} />
      <View style={[styles.searchBar, styles.searchBarActivo]}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={(t) => { setQuery(t); if (t.length > 0) setBuscando(false); }}
          placeholder="Buscar..."
          placeholderTextColor={Colors.textMuted}
          onFocus={() => setBuscando(true)}
        />
        <Ionicons name="mic-outline" size={18} color={Colors.textMuted} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.seccion}>Géneros que aún no exploras...</Text>
        <View style={styles.generoGrid}>
          {generos.map(g => (
            <TouchableOpacity
              key={g.id}
              style={[styles.generoCard, { backgroundColor: g.color }]}
            >
              <Text style={styles.generoNombre}>{g.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.seccion}>Toques que podrían interesarte...</Text>
        <View style={styles.toquesRow}>
          {toquesDestacados.map(t => (
            <View key={t.id} style={styles.toqueCard}>
              <View style={styles.toqueImg} />
              <Text style={styles.toqueNombre}>{t.nombre}</Text>
              <Text style={styles.toqueRating}>{'★'.repeat(Math.round(t.rating))} {t.rating}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    margin: 16, backgroundColor: Colors.card,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
  },
  searchBarActivo: {
    borderWidth: 2, borderColor: Colors.primary,
  },
  searchInput: { flex: 1, color: Colors.text, fontSize: 14 },
  seccion: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 14, marginTop: 4 },
  generoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  generoCard: {
    width: '47%', height: 60, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  generoNombre: { color: Colors.text, fontWeight: '800', fontSize: 13, letterSpacing: 1 },
  toquesRow: { flexDirection: 'row', gap: 12 },
  toqueCard: { flex: 1 },
  toqueImg: { height: 100, backgroundColor: Colors.border, borderRadius: 10, marginBottom: 6 },
  toqueNombre: { color: Colors.text, fontWeight: '700', fontSize: 12 },
  toqueRating: { color: Colors.primary, fontSize: 11 },
  artistaResultado: { alignItems: 'flex-start', marginBottom: 16 },
  artistaImg: { width: 150, height: 150, borderRadius: 10, marginBottom: 8 },
  artistaNombre: { color: Colors.text, fontWeight: '900', fontSize: 16 },
  cancionRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  cancionImg: { width: 48, height: 48, borderRadius: 6 },
  cancionTitulo: { color: Colors.text, fontWeight: '600', fontSize: 14 },
  cancionArtista: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  puntos: { color: Colors.textMuted, fontSize: 18 },
  sinResultados: { color: Colors.textMuted, textAlign: 'center', marginTop: 40, fontSize: 14 },
});