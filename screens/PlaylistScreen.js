import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Image
} from 'react-native';
import { Colors } from '../constants/colors';
import Header from '../components/Header';
import ReproductorScreen from './ReproductorScreen';

const imgSinValor = require('../assets/foto_artista.png');
const imgLolito = require('../assets/lolitosinclair.jpg');
const imgRlnZu = require('../assets/RlnZu.jpeg');
const imgVampira = require('../assets/Vampira.jpeg');
const imgCuchas = require('../assets/cuchas.jpeg');
const imgDiamante = require('../assets/Diamanteelectrico.jpeg');
const imgK93 = require('../assets/k93.png');
const imgSaikoro = require('../assets/saikoro.png');

const audioAvanza = require('../assets/sinvalor_avanza.mp3');
const audioConsumido = require('../assets/sinvalor_consumido.mp3');
const audioSinValor = require('../assets/sinvalor_sinvalor.mp3');
const audioUnDiaTriste = require('../assets/undia_triste_rlnzu.mp3');
const audioVampira = require('../assets/vampira_911.mp3');
const audioCuchas = require('../assets/cuchas_sobrepensando.mp3');
const audioLolito = require('../assets/lolitossinclair.mp3');
const audioDiamante = require('../assets/diamante_kamikaze.mp3');

const imagenes = [
  imgSinValor,
  imgLolito,
  imgRlnZu,
  imgVampira,
  imgCuchas,
  imgDiamante,
  imgK93,
  imgSaikoro,
];

const imgAleatoria = (i) => imagenes[i % imagenes.length];

const obtenerImagenCancion = (titulo, artista, index = 0) => {
  const tituloNormalizado = titulo?.toLowerCase() || '';
  const artistaNormalizado = artista?.toLowerCase() || '';

  if (artistaNormalizado.includes('sin valor')) return imgSinValor;
  if (artistaNormalizado.includes('lolito')) return imgLolito;
  if (artistaNormalizado.includes('rlnzu')) return imgRlnZu;
  if (artistaNormalizado.includes('vampira')) return imgVampira;
  if (artistaNormalizado.includes('cuchas')) return imgCuchas;
  if (artistaNormalizado.includes('diamante')) return imgDiamante;
  if (artistaNormalizado.includes('k93')) return imgK93;
  if (artistaNormalizado.includes('saikoro')) return imgSaikoro;

  if (tituloNormalizado.includes('vampira')) return imgVampira;
  if (tituloNormalizado.includes('kamikaze')) return imgDiamante;
  if (tituloNormalizado.includes('sobrepensando')) return imgCuchas;
  if (tituloNormalizado.includes('un día triste')) return imgRlnZu;

  return imgAleatoria(index);
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

const sugerenciasBase = [
  { id: 's1', titulo: 'Earrings', artista: 'Malcon Todd' },
  { id: 's2', titulo: 'Acá el Frío Es Peor', artista: 'Saikoro!' },
  { id: 's3', titulo: 'Void', artista: 'Pkuya' },
];

export default function PlaylistScreen({ playlist, onClose }) {
  const [cancionActiva, setCancionActiva] = useState(null);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [listaActiva, setListaActiva] = useState([]);

  const cancionesPlaylist = (playlist?.canciones || []).map((c, index) => {
    if (typeof c === 'string') {
      return {
        id: `c-${index}`,
        titulo: c,
        artista: '',
        imagen: obtenerImagenCancion(c, '', index),
        audio: obtenerAudioCancion(c, '')
      };
    }

    return {
      id: c.id || c._id || `c-${index}`,
      titulo: c.titulo || 'Canción sin título',
      artista: c.artista || '',
      genero: c.genero || '',
      album: c.album || '',
      imagen: c.imagen || obtenerImagenCancion(c.titulo, c.artista, index),
      audio: c.audio || obtenerAudioCancion(c.titulo, c.artista)
    };
  });

  const sugerencias = sugerenciasBase.map((s, index) => ({
    ...s,
    imagen: obtenerImagenCancion(s.titulo, s.artista, index + 3),
    audio: obtenerAudioCancion(s.titulo, s.artista)
  }));

  const todasCanciones = [...cancionesPlaylist, ...sugerencias];

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

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={onClose} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {playlist?.imagen ? (
          <Image source={playlist.imagen} style={styles.playlistCover} />
        ) : (
          <View style={styles.playlistCover} />
        )}

        <Text style={styles.playlistNombre}>{playlist?.nombre || 'Playlist'}</Text>

        {cancionesPlaylist.length === 0 && (
          <Text style={styles.sinCanciones}>Esta playlist todavía no tiene canciones.</Text>
        )}

        {cancionesPlaylist.map((c, i) => (
          <TouchableOpacity
            key={c.id}
            style={styles.cancionRow}
            activeOpacity={0.7}
            onPress={() => {
              setListaActiva(todasCanciones);
              setIndiceActivo(i);
              setCancionActiva(c);
            }}
          >
            <Image source={c.imagen} style={styles.cancionImg} />

            <View style={{ flex: 1 }}>
              <Text style={styles.cancionTitulo}>{c.titulo}</Text>
              {!!c.artista && <Text style={styles.cancionArtista}>{c.artista}</Text>}
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.subtitulo}>SUGERENCIAS</Text>

        {sugerencias.map((s, i) => (
          <TouchableOpacity
            key={s.id}
            style={styles.cancionRow}
            activeOpacity={0.7}
            onPress={() => {
              const idx = cancionesPlaylist.length + i;
              setListaActiva(todasCanciones);
              setIndiceActivo(idx);
              setCancionActiva(s);
            }}
          >
            <Image source={s.imagen} style={styles.cancionImg} />

            <View>
              <Text style={styles.cancionTitulo}>{s.titulo}</Text>
              <Text style={styles.cancionArtista}>{s.artista}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  subtitulo: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 10
  },
  playlistCover: {
    width: 160,
    height: 160,
    backgroundColor: Colors.border,
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
  sinCanciones: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 13
  },
  cancionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  cancionImg: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: Colors.border
  },
  cancionTexto: {
    color: Colors.text,
    fontSize: 13
  },
  cancionTitulo: {
    color: Colors.text,
    fontWeight: '600'
  },
  cancionArtista: {
    color: Colors.textMuted,
    fontSize: 12
  },
});