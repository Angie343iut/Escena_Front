import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput, Image
} from 'react-native';
import { Colors } from '../constants/colors';
import Header from '../components/Header';
import ReproductorScreen from './ReproductorScreen';
import { useChat } from '../context/ChatContext';

const imgSinValor = require('../assets/foto_artista.png');
const imgLolito = require('../assets/lolitosinclair.jpg');
const imgRlnZu = require('../assets/RlnZu.jpeg');
const imgVampira = require('../assets/Vampira.jpeg');
const imgCuchas = require('../assets/cuchas.jpeg');
const imgDiamante = require('../assets/Diamanteelectrico.jpeg');
const imgK93 = require('../assets/k93.png');
const imgSaikoro = require('../assets/saikoro.png');

const audios = [
  require('../assets/sinvalor_avanza.mp3'),
  require('../assets/sinvalor_consumido.mp3'),
  require('../assets/sinvalor_sinvalor.mp3'),
  require('../assets/undia_triste_rlnzu.mp3'),
  require('../assets/vampira_911.mp3'),
  require('../assets/cuchas_sobrepensando.mp3'),
  require('../assets/lolitossinclair.mp3'),
  require('../assets/diamante_kamikaze.mp3'),
];
const audioAleatorio = () => audios[Math.floor(Math.random() * audios.length)];

const cancionesDisponibles = [
  { id: '1', titulo: 'Earrings', artista: 'Malcon Todd', imagen: imgK93, audio: audioAleatorio() },
  { id: '2', titulo: 'Acá El Frío Es Peor', artista: 'Saikoro!', imagen: imgSaikoro, audio: audioAleatorio() },
  { id: '3', titulo: 'Void', artista: 'Pouya', imagen: imgRlnZu, audio: audioAleatorio() },
  { id: '4', titulo: 'Consumido', artista: 'Sin Valor', imagen: imgSinValor, audio: audioAleatorio() },
];

export default function ListaPlaylist({ onClose }) {
  const [nombre, setNombre] = useState('');
  const [cancionActiva, setCancionActiva] = useState(null);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const { abrirPerfil } = useChat();

  if (cancionActiva) {
    return (
      <ReproductorScreen
        cancion={cancionActiva}
        canciones={cancionesDisponibles}
        indice={indiceActivo}
        onClose={() => setCancionActiva(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={onClose} onPerfil={abrirPerfil} />
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.cover}>
          <Image source={imgK93} style={styles.coverImagen} />
        </View>

        <TextInput
          style={styles.nombreInput}
          placeholder="Playlist sin Nombre"
          placeholderTextColor="#555"
          value={nombre}
          onChangeText={setNombre}
          textAlign="center"
        />

        <TouchableOpacity style={styles.agregarRow}>
          <View style={styles.plusCircle}>
            <Text style={styles.plusText}>+</Text>
          </View>
          <Text style={styles.agregarTexto}>Agregar una canción</Text>
        </TouchableOpacity>

        <Text style={styles.subtitulo}>SUGERENCIAS</Text>
        {cancionesDisponibles.map((c, i) => (
          <TouchableOpacity
            key={c.id}
            style={styles.cancionRow}
            activeOpacity={0.7}
            onPress={() => {
              setIndiceActivo(i);
              setCancionActiva(c);
            }}
          >
            <Image source={c.imagen} style={styles.cancionImg} />
            <View style={styles.cancionInfo}>
              <Text style={styles.cancionTitulo}>{c.titulo}</Text>
              <Text style={styles.cancionArtista}>{c.artista}</Text>
            </View>
            <TouchableOpacity style={styles.menuBtn}>
              <Text style={styles.menuDots}>⋮</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  cover: {
    width: 160, height: 160,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  coverImagen: { width: '100%', height: '100%' },
  nombreInput: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 24,
    paddingVertical: 4,
  },
  agregarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  plusCircle: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: { color: Colors.text, fontSize: 22, fontWeight: '700', lineHeight: 26 },
  agregarTexto: { color: Colors.text, fontSize: 15 },
  subtitulo: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 14,
  },
  cancionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cancionImg: { width: 48, height: 48, borderRadius: 6 },
  cancionInfo: { flex: 1 },
  cancionTitulo: { color: Colors.text, fontWeight: '700', fontSize: 14 },
  cancionArtista: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  menuBtn: { padding: 8 },
  menuDots: { color: Colors.textMuted, fontSize: 18, fontWeight: '700' },
});