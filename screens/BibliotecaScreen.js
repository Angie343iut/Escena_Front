import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Modal, Image, ActivityIndicator, Alert
} from 'react-native';
import { Colors } from '../constants/colors';
import Header from '../components/Header';
import ListaPlaylist from './ListaPlaylist';
import ReproductorScreen from './ReproductorScreen';
import { API_URL } from '../api/api';

const imgHyperr = require('../assets/playlisthyper.jpg');
const imgSuavecito = require('../assets/playlistsuavecito.jpg');
const imgPostPunk = require('../assets/playlistpost-punk.jpg');

const imgSinValor = require('../assets/foto_artista.png');
const imgRlnZu = require('../assets/RlnZu.jpeg');
const imgVampira = require('../assets/Vampira.jpeg');
const imgCuchas = require('../assets/cuchas.jpeg');
const imgDiamante = require('../assets/Diamanteelectrico.jpeg');
const imgK93 = require('../assets/k93.png');

const audioAvanza = require('../assets/sinvalor_avanza.mp3');
const audioConsumido = require('../assets/sinvalor_consumido.mp3');
const audioSinValor = require('../assets/sinvalor_sinvalor.mp3');
const audioUnDiaTriste = require('../assets/undia_triste_rlnzu.mp3');
const audioVampira = require('../assets/vampira_911.mp3');
const audioCuchas = require('../assets/cuchas_sobrepensando.mp3');
const audioLolito = require('../assets/lolitossinclair.mp3');
const audioDiamante = require('../assets/diamante_kamikaze.mp3');

const obtenerImagenPlaylist = (nombre) => {
  const nombreNormalizado = nombre?.toLowerCase() || '';

  if (nombreNormalizado.includes('hyper')) return imgHyperr;
  if (nombreNormalizado.includes('suave')) return imgSuavecito;
  if (nombreNormalizado.includes('post')) return imgPostPunk;
  if (nombreNormalizado.includes('rock')) return imgHyperr;

  return imgHyperr;
};

const obtenerImagenCancion = (titulo, artista) => {
  const tituloNormalizado = titulo?.toLowerCase() || '';
  const artistaNormalizado = artista?.toLowerCase() || '';

  if (artistaNormalizado.includes('sin valor')) return imgSinValor;
  if (artistaNormalizado.includes('rlnzu')) return imgRlnZu;
  if (artistaNormalizado.includes('vampira')) return imgVampira;
  if (artistaNormalizado.includes('cuchas')) return imgCuchas;
  if (artistaNormalizado.includes('diamante')) return imgDiamante;
  if (artistaNormalizado.includes('k93')) return imgK93;

  if (tituloNormalizado.includes('vampira')) return imgVampira;
  if (tituloNormalizado.includes('kamikaze')) return imgDiamante;
  if (tituloNormalizado.includes('sobrepensando')) return imgCuchas;
  if (tituloNormalizado.includes('un día triste')) return imgRlnZu;

  return imgSinValor;
};

const obtenerAudioCancion = (titulo, artista) => {
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

export default function BibliotecaScreen() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistActiva, setPlaylistActiva] = useState(null);
  const [crearVisible, setCrearVisible] = useState(false);
  const [cancionActiva, setCancionActiva] = useState(null);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [listaActiva, setListaActiva] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPlaylists();
  }, []);

  const cargarPlaylists = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch(`${API_URL}/playlists`);
      const data = await respuesta.json();

      const playlistsBackend = (data.data || []).map((playlist) => {
        const imagenPlaylist = obtenerImagenPlaylist(playlist.nombre);

        return {
          id: playlist._id,
          _id: playlist._id,
          nombre: playlist.nombre,
          usuario: playlist.usuario,
          descripcion: playlist.descripcion,
          imagen: imagenPlaylist,
          canciones: (playlist.canciones || []).map((cancion) => ({
            id: cancion._id,
            _id: cancion._id,
            titulo: cancion.titulo,
            artista: cancion.artista,
            genero: cancion.genero,
            album: cancion.album,
            imagen: obtenerImagenCancion(cancion.titulo, cancion.artista),
            audio: obtenerAudioCancion(cancion.titulo, cancion.artista)
          }))
        };
      });

      setPlaylists(playlistsBackend);
    } catch (error) {
      console.log('Error cargando playlists:', error);
      Alert.alert('Error', 'No se pudieron cargar las playlists.');
    } finally {
      setCargando(false);
    }
  };

  const playlist = playlists.find(p => p.id === playlistActiva);

  const sugerencias = playlists
    .flatMap(p => p.canciones || [])
    .slice(0, 3);

  if (cancionActiva) {
    return (
      <ReproductorScreen
        cancion={cancionActiva}
        canciones={listaActiva}
        indice={indiceActivo}
        onClose={() => setCancionActiva(null)}
      />
    );
  }

  if (playlistActiva && playlist) {
    const todasCanciones = [...playlist.canciones, ...sugerencias];

    return (
      <SafeAreaView style={styles.container}>
        <Header onBack={() => setPlaylistActiva(null)} />

        <ScrollView contentContainerStyle={styles.scroll}>
          <Image source={playlist.imagen} style={styles.playlistCover} />
          <Text style={styles.playlistNombre}>{playlist.nombre}</Text>

          {playlist.canciones.length === 0 && (
            <Text style={styles.sinResultados}>Esta playlist todavía no tiene canciones.</Text>
          )}

          {playlist.canciones.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.cancionRow}
              activeOpacity={0.7}
              onPress={() => {
                const idx = todasCanciones.findIndex(x => x.id === c.id);
                setListaActiva(todasCanciones);
                setIndiceActivo(idx);
                setCancionActiva(c);
              }}
            >
              <Image source={c.imagen} style={styles.cancionImg} />

              <View style={{ flex: 1 }}>
                <Text style={styles.cancionTitulo}>{c.titulo}</Text>
                <Text style={styles.cancionArtista}>{c.artista}</Text>
              </View>

              <Text style={styles.puntos}>⋮</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.subtitulo}>SUGERENCIAS</Text>

          {sugerencias.map(s => (
            <TouchableOpacity
              key={s.id}
              style={styles.cancionRow}
              activeOpacity={0.7}
              onPress={() => {
                const idx = todasCanciones.findIndex(x => x.id === s.id);
                setListaActiva(todasCanciones);
                setIndiceActivo(idx);
                setCancionActiva(s);
              }}
            >
              <Image source={s.imagen} style={styles.cancionImg} />

              <View style={{ flex: 1 }}>
                <Text style={styles.cancionTitulo}>{s.titulo}</Text>
                <Text style={styles.cancionArtista}>{s.artista}</Text>
              </View>

              <Text style={styles.puntos}>⋮</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>BIBLIOTECA</Text>

        {cargando && (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.loadingText}>Cargando playlists...</Text>
          </View>
        )}

        {!cargando && playlists.length === 0 && (
          <Text style={styles.sinResultados}>No hay playlists disponibles.</Text>
        )}

        {!cargando && playlists.map(p => (
          <TouchableOpacity
            key={p.id}
            style={styles.playlistCard}
            onPress={() => setPlaylistActiva(p.id)}
          >
            <Image source={p.imagen} style={styles.playlistImg} />
            <View style={{ flex: 1 }}>
              <Text style={styles.playlistCardNombre}>{p.nombre}</Text>
              <Text style={styles.playlistCardSub}>
                {p.canciones.length} canciones
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.crearBox}>
          <Text style={styles.crearTexto}>
            Crea tus mixes con tu música favorita{'\n'}¡Todo lo que agregues los verás acá!
          </Text>

          <TouchableOpacity style={styles.plusBtn} onPress={() => setCrearVisible(true)}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={crearVisible} animationType="slide">
        <ListaPlaylist onClose={() => setCrearVisible(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  titulo: { color: Colors.text, fontSize: 28, fontWeight: '900', marginBottom: 16 },
  subtitulo: { color: Colors.text, fontSize: 15, fontWeight: '800', marginTop: 20, marginBottom: 10 },
  loadingBox: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },
  loadingText: { color: Colors.textMuted, fontSize: 13 },
  sinResultados: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
    fontSize: 14
  },
  playlistCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  playlistImg: { width: 60, height: 60, borderRadius: 8 },
  playlistCardNombre: { color: Colors.text, fontWeight: '700', fontSize: 16 },
  playlistCardSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  crearBox: { alignItems: 'center', marginTop: 24, padding: 16 },
  crearTexto: { color: Colors.textMuted, textAlign: 'center', marginBottom: 16, fontSize: 14 },
  plusBtn: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  plusText: { color: Colors.background, fontSize: 24, fontWeight: '900' },
  playlistCover: {
    width: 160,
    height: 160,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 12
  },
  playlistNombre: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20
  },
  cancionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  cancionImg: { width: 44, height: 44, borderRadius: 6, backgroundColor: Colors.border },
  cancionTitulo: { color: Colors.text, fontWeight: '600', fontSize: 14 },
  cancionArtista: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  puntos: { color: Colors.textMuted, fontSize: 18 },
});