import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Image, ActivityIndicator
} from 'react-native';
import { Colors } from '../constants/colors';
import ReproductorScreen from './ReproductorScreen';
import Header from '../components/Header';
import PerfilArtistaScreen from './PerfilArtistaScreen';
import PlaylistScreen from './PlaylistScreen.js';
import { API_URL } from '../api/api';

const imgK93 = require('../assets/k93.png');
const imgSaikoro = require('../assets/saikoro.png');
const imgSinValor = require('../assets/foto_artista.png');
const imgLolito = require('../assets/lolitosinclair.jpg');
const imgRlnZu = require('../assets/RlnZu.jpeg');
const imgVampira = require('../assets/Vampira.jpeg');
const imgCuchas = require('../assets/cuchas.jpeg');
const imgDiamante = require('../assets/Diamanteelectrico.jpeg');
const imgRockColombiano = require('../assets/rock_colombiano.jpg');
const imgSuavecito = require('../assets/suavecito.jpg');
const imgPostPunk = require('../assets/post-punk.jpg');

const audioAvanza = require('../assets/sinvalor_avanza.mp3');
const audioConsumido = require('../assets/sinvalor_consumido.mp3');
const audioSinValor = require('../assets/sinvalor_sinvalor.mp3');
const audioUnDiaTriste = require('../assets/undia_triste_rlnzu.mp3');
const audioVampira = require('../assets/vampira_911.mp3');
const audioCuchas = require('../assets/cuchas_sobrepensando.mp3');
const audioLolito = require('../assets/lolitossinclair.mp3');
const audioDiamante = require('../assets/diamante_kamikaze.mp3');

const obtenerImagenLocal = (titulo, artista) => {
  const tituloNormalizado = titulo?.toLowerCase() || '';
  const artistaNormalizado = artista?.toLowerCase() || '';

  if (artistaNormalizado.includes('k93')) return imgK93;
  if (artistaNormalizado.includes('saikoro')) return imgSaikoro;
  if (artistaNormalizado.includes('rlnzu')) return imgRlnZu;
  if (artistaNormalizado.includes('vampira')) return imgVampira;
  if (artistaNormalizado.includes('cuchas')) return imgCuchas;
  if (artistaNormalizado.includes('diamante')) return imgDiamante;
  if (artistaNormalizado.includes('lolito')) return imgLolito;
  if (artistaNormalizado.includes('sin valor')) return imgSinValor;

  if (tituloNormalizado.includes('vampira')) return imgVampira;
  if (tituloNormalizado.includes('kamikaze')) return imgDiamante;
  if (tituloNormalizado.includes('sobrepensando')) return imgCuchas;
  if (tituloNormalizado.includes('un día triste')) return imgRlnZu;

  return imgSinValor;
};

const obtenerAudioLocal = (titulo, artista) => {
  const tituloNormalizado = titulo?.toLowerCase() || '';
  const artistaNormalizado = artista?.toLowerCase() || '';

  if (tituloNormalizado.includes('avanza')) return audioAvanza;
  if (tituloNormalizado.includes('consumido')) return audioConsumido;
  if (tituloNormalizado === 'sin valor') return audioSinValor;
  if (tituloNormalizado.includes('un día triste')) return audioUnDiaTriste;
  if (tituloNormalizado.includes('vampira')) return audioVampira;
  if (tituloNormalizado.includes('sobrepensando')) return audioCuchas;
  if (tituloNormalizado.includes('lolito')) return audioLolito;
  if (tituloNormalizado.includes('kamikaze')) return audioDiamante;

  if (artistaNormalizado.includes('diamante')) return audioDiamante;
  if (artistaNormalizado.includes('cuchas')) return audioCuchas;
  if (artistaNormalizado.includes('vampira')) return audioVampira;
  if (artistaNormalizado.includes('rlnzu')) return audioUnDiaTriste;

  return audioAvanza;
};

const artistas = [
  { id: '1', nombre: 'K93', imagen: imgK93 },
  { id: '2', nombre: 'Saikoro!', imagen: imgSaikoro },
  { id: '3', nombre: 'Lolito Sinclair', imagen: imgLolito },
  { id: '4', nombre: 'Diamante Eléctrico', imagen: imgDiamante },
];

const forosHome = [
  { id: '1', nombre: '#indie', imagen: imgSaikoro },
  { id: '2', nombre: '#rock', imagen: imgK93 },
  { id: '3', nombre: '#trap', imagen: imgLolito },
  { id: '4', nombre: '#metal', imagen: imgDiamante },
];

const imagenPlaylistLocal = (nombre) => {
  const nombreNormalizado = nombre?.toLowerCase() || '';

  if (nombreNormalizado.includes('rock')) return imgRockColombiano;
  if (nombreNormalizado.includes('post')) return imgPostPunk;
  if (nombreNormalizado.includes('suave')) return imgSuavecito;

  return imgRockColombiano;
};

export default function HomeScreen({ navigation }) {
  const [canciones, setCanciones] = useState([]);
  const [mixes, setMixes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [cancionActiva, setCancionActiva] = useState(null);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [artistaActivo, setArtistaActivo] = useState(null);
  const [ultimoArtista, setUltimoArtista] = useState(null);
  const [desdePerfil, setDesdePerfil] = useState(false);
  const [mixActivo, setMixActivo] = useState(null);

  useEffect(() => {
    cargarDatosHome();
  }, []);

  const cargarDatosHome = async () => {
    try {
      setCargando(true);

      const [respuestaCanciones, respuestaPlaylists] = await Promise.all([
        fetch(`${API_URL}/canciones`),
        fetch(`${API_URL}/playlists`)
      ]);

      const dataCanciones = await respuestaCanciones.json();
      const dataPlaylists = await respuestaPlaylists.json();

      const cancionesBackend = (dataCanciones.data || []).map((cancion) => ({
        id: cancion._id,
        _id: cancion._id,
        titulo: cancion.titulo,
        artista: cancion.artista,
        genero: cancion.genero,
        album: cancion.album,
        descripcion: cancion.descripcion,
        imagenUrl: cancion.imagenUrl,
        audioUrl: cancion.audioUrl,
        imagen: obtenerImagenLocal(cancion.titulo, cancion.artista),
        audio: obtenerAudioLocal(cancion.titulo, cancion.artista)
      }));

      const playlistsBackend = (dataPlaylists.data || []).map((playlist) => ({
        id: playlist._id,
        _id: playlist._id,
        nombre: playlist.nombre,
        usuario: playlist.usuario,
        descripcion: playlist.descripcion,
        imagenUrl: playlist.imagenUrl,
        imagen: imagenPlaylistLocal(playlist.nombre),
        canciones: (playlist.canciones || []).map((cancion) => ({
          id: cancion._id,
          _id: cancion._id,
          titulo: cancion.titulo,
          artista: cancion.artista,
          genero: cancion.genero,
          album: cancion.album,
          imagen: obtenerImagenLocal(cancion.titulo, cancion.artista),
          audio: obtenerAudioLocal(cancion.titulo, cancion.artista)
        }))
      }));

      setCanciones(cancionesBackend);
      setMixes(playlistsBackend);
    } catch (error) {
      console.log('Error cargando datos del Home:', error);
    } finally {
      setCargando(false);
    }
  };

  const columnas = [];
  for (let i = 0; i < canciones.length; i += 2) {
    columnas.push([canciones[i], canciones[i + 1]]);
  }

  if (cancionActiva) {
    return (
      <ReproductorScreen
        cancion={cancionActiva}
        canciones={canciones}
        indice={indiceActivo}
        onClose={() => {
          setCancionActiva(null);
          if (!desdePerfil) {
            setArtistaActivo(null);
            setUltimoArtista(null);
          }
          setDesdePerfil(false);
        }}
      />
    );
  }

  if (artistaActivo) {
    return (
      <PerfilArtistaScreen
        artista={ultimoArtista}
        onClose={() => {
          setArtistaActivo(null);
          setUltimoArtista(null);
        }}
        onPlayCancion={(c, lista, idx) => {
          setCancionActiva(c);
          setIndiceActivo(idx || 0);
          setDesdePerfil(true);
        }}
      />
    );
  }

  if (mixActivo) {
    return <PlaylistScreen playlist={mixActivo} onClose={() => setMixActivo(null)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>HOME</Text>

        {cargando ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.loadingText}>Cargando datos de ESCENA...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.subtitulo}>Tu música</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              <View style={styles.gridCanciones}>
                {columnas.map((col, colIndex) => (
                  <View key={colIndex} style={styles.columna}>
                    {col.map(c => c ? (
                      <TouchableOpacity
                        key={c.id}
                        style={styles.cancionCard}
                        onPress={() => {
                          const idx = canciones.findIndex(x => x.id === c.id);
                          setIndiceActivo(idx);
                          setCancionActiva(c);
                          setDesdePerfil(false);
                        }}
                      >
                        <Image source={c.imagen} style={styles.cancionImg} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cancionTitulo} numberOfLines={1}>{c.titulo}</Text>
                          <Text style={styles.cancionArtista}>{c.artista}</Text>
                        </View>
                        <Text style={styles.puntos}>⋮</Text>
                      </TouchableOpacity>
                    ) : null)}
                  </View>
                ))}
              </View>
            </ScrollView>

            <Text style={styles.subtitulo}>Conoce a otros como tu...</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {artistas.map(a => (
                <TouchableOpacity
                  key={a.id}
                  style={styles.artistaCard}
                  onPress={() => {
                    setUltimoArtista(a);
                    setArtistaActivo(a);
                  }}
                >
                  <Image source={a.imagen} style={styles.artistaImg} />
                  <Text style={styles.artistaNombre}>{a.nombre}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.subtitulo}>Tus Foros</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {forosHome.map(f => (
                <TouchableOpacity
                  key={f.id}
                  style={styles.foroCard}
                  onPress={() => navigation.navigate('Foros', { foroInicial: f.nombre })}
                >
                  <Image source={f.imagen} style={styles.foroImg} />
                  <Text style={styles.foroNombre}>{f.nombre}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.subtitulo}>¿Quieres participar en un toque?</Text>
            <Text style={styles.muted}>Revisa el mapa de toques y consulta</Text>
            <TouchableOpacity style={styles.mapaCard} onPress={() => navigation.navigate('Toques')}>
              <View style={styles.mapaPlaceholder} />
              <View style={styles.mapaOverlay}>
                <Text style={styles.mapaTexto}>MAPA DE{'\n'}TOQUES</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.subtitulo}>Mixes donde apareces</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
              {mixes.map(m => (
                <TouchableOpacity key={m.id} style={styles.mixCard} onPress={() => setMixActivo(m)}>
                  <Image source={m.imagen} style={styles.mixImg} />
                  <Text style={styles.mixNombre}>{m.nombre}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  titulo: { color: Colors.text, fontSize: 28, fontWeight: '900', marginBottom: 16 },
  subtitulo: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 10 },
  muted: { color: Colors.textMuted, fontSize: 13, marginBottom: 8 },
  loadingBox: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    marginBottom: 16
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13
  },
  gridCanciones: { flexDirection: 'row', gap: 8 },
  columna: { flexDirection: 'column', gap: 8 },
  cancionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: 8, padding: 10, gap: 8, width: 180 },
  cancionImg: { width: 40, height: 40, borderRadius: 6 },
  cancionTitulo: { color: Colors.text, fontWeight: '600', fontSize: 12 },
  cancionArtista: { color: Colors.textMuted, fontSize: 10 },
  puntos: { color: Colors.textMuted, fontSize: 16 },
  artistaCard: { alignItems: 'center', marginRight: 16 },
  artistaImg: { width: 140, height: 140, borderRadius: 10, marginBottom: 6 },
  artistaNombre: { color: Colors.text, fontSize: 13, fontWeight: '600' },
  foroCard: { alignItems: 'center', marginRight: 16 },
  foroImg: { width: 160, height: 100, borderRadius: 10, marginBottom: 6 },
  foroNombre: { color: Colors.text, fontSize: 13 },
  mapaCard: { height: 180, borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  mapaPlaceholder: { width: '100%', height: '100%', backgroundColor: '#1a2a1a' },
  mapaOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(0,0,0,0.5)' },
  mapaTexto: { color: Colors.text, fontSize: 22, fontWeight: '900' },
  mixCard: { alignItems: 'center', marginRight: 16 },
  mixImg: { width: 120, height: 120, borderRadius: 10, marginBottom: 6 },
  mixNombre: { color: Colors.text, fontSize: 13, fontWeight: '600' },
});