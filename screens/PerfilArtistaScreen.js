import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Image
} from 'react-native';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { useChat } from '../context/ChatContext';
import ReproductorScreen from './ReproductorScreen';

const fotoSinValor = require('../assets/foto_artista.png');
const fotoK93 = require('../assets/k93.png');
const fotoSaikoro = require('../assets/saikoro.png');

const imgPlaylist = require('../assets/playlist.jpg');
const imgCarroña = require('../assets/carroña.jpg');
const imgAlbumK93 = require('../assets/albumk93.png');
const imgPlaylistK93 = require('../assets/playlistk93.png');

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

export default function PerfilArtistaScreen({ artista, onClose, onPlayCancion }) {
  const [siguiendo, setSiguiendo] = useState(false);
  const [cancionActiva, setCancionActiva] = useState(null);
  const { abrirChat } = useChat();

  const nombre = artista?.nombre || 'SIN VALOR';

  const getFotoPerfil = () => {
    if (artista?.imagen) return artista.imagen;
    return fotoSinValor;
  };

  const getCanciones = () => {
    const imgArtista = artista?.imagen || fotoSinValor;

    if (nombre === 'K93') return [
      { id: '1', titulo: 'Ruta 40', artista: 'K93', imagen: imgPlaylistK93, audio: audioAleatorio() },
      { id: '2', titulo: 'Noche Vieja', artista: 'K93', imagen: imgPlaylistK93, audio: audioAleatorio() },
      { id: '3', titulo: 'El Puente', artista: 'K93', imagen: imgAlbumK93, audio: audioAleatorio() },
      { id: '4', titulo: 'Barrio Sur', artista: 'K93', imagen: imgPlaylistK93, audio: audioAleatorio() },
      { id: '5', titulo: 'Sin Salida', artista: 'K93', imagen: imgPlaylistK93, audio: audioAleatorio() },
      { id: '6', titulo: 'Última Vez', artista: 'K93', imagen: imgAlbumK93, audio: audioAleatorio() },
    ];
    if (nombre === 'Saikoro!') return [
      { id: '1', titulo: 'Acá el Frío Es Peor', artista: 'Saikoro!', imagen: fotoSaikoro, audio: audioAleatorio() },
      { id: '2', titulo: 'Consumido', artista: 'Saikoro!', imagen: fotoSaikoro, audio: audioAleatorio() },
      { id: '3', titulo: 'Earrings', artista: 'Saikoro!', imagen: fotoSaikoro, audio: audioAleatorio() },
      { id: '4', titulo: 'Void', artista: 'Saikoro!', imagen: fotoSaikoro, audio: audioAleatorio() },
      { id: '5', titulo: 'N.N.', artista: 'Saikoro!', imagen: fotoSaikoro, audio: audioAleatorio() },
      { id: '6', titulo: 'Gun', artista: 'Saikoro!', imagen: fotoSaikoro, audio: audioAleatorio() },
    ];
    return [
      { id: '1', titulo: 'Track 1', artista: nombre, imagen: imgArtista, audio: audioAleatorio() },
      { id: '2', titulo: 'Track 2', artista: nombre, imagen: imgArtista, audio: audioAleatorio() },
      { id: '3', titulo: 'Track 3', artista: nombre, imagen: imgArtista, audio: audioAleatorio() },
      { id: '4', titulo: 'Track 4', artista: nombre, imagen: imgArtista, audio: audioAleatorio() },
      { id: '5', titulo: 'Track 5', artista: nombre, imagen: imgArtista, audio: audioAleatorio() },
      { id: '6', titulo: 'Track 6', artista: nombre, imagen: imgArtista, audio: audioAleatorio() },
    ];
  };

  const canciones = getCanciones();

  if (cancionActiva) {
    return (
      <ReproductorScreen
        cancion={cancionActiva}
        onClose={() => setCancionActiva(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={onClose} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topSection}>
          <Image source={getFotoPerfil()} style={styles.fotoPerfil} />
          <Text style={styles.nombre}>{nombre}</Text>
          <View style={styles.badgesRow}>
            <View style={styles.badgeMusico}>
              <Text style={styles.badgeText}>♪ Músico</Text>
            </View>
            <View style={styles.badgeColaborador}>
              <Ionicons name="hand-left" size={12} color={Colors.background} />
              <Text style={styles.badgeText}> Colaborador</Text>
            </View>
          </View>
          <Text style={styles.bio}>
            Somos {nombre}{'\n'}
            Los esperamos el 2 de mayo en Acto Latino.{'\n'}
            LA ESTRUCTURA disponible en streaming.
          </Text>
          <View style={styles.botonesRow}>
            <TouchableOpacity style={styles.btnMensaje} onPress={() => abrirChat(artista)}>
              <Text style={styles.btnMensajeText}>Mensaje</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnSeguir, siguiendo && styles.btnSiguiendo]}
              onPress={() => setSiguiendo(!siguiendo)}
            >
              <Text style={[styles.btnSeguirText, siguiendo && styles.btnSiguiendoText]}>
                {siguiendo ? 'Siguiendo' : 'Seguir'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.seccion}>Música</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={styles.gridCanciones}>
            {[[canciones[0], canciones[1]], [canciones[2], canciones[3]], [canciones[4], canciones[5]]].map((col, i) => (
              <View key={i} style={styles.columna}>
                {col.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.cancionCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (onPlayCancion) {
                        onPlayCancion(c);
                      } else {
                        setCancionActiva(c);
                      }
                    }}
                  >
                    <Image source={c.imagen} style={styles.cancionImg} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cancionTitulo} numberOfLines={1}>{c.titulo}</Text>
                      <Text style={styles.cancionArtista}>{c.artista}</Text>
                    </View>
                    <Text style={styles.puntos}>⋮</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.seccion}>Verificaciones</Text>
        <View style={styles.verificacionCard}>
          <Text style={styles.verificacionTitulo}>
            Músico Activo <Text style={styles.verificacionSub}>5 releases publicados</Text>
          </Text>
          <View style={styles.activoBadge}>
            <Text style={styles.activoText}>Activo</Text>
          </View>
        </View>

        <Text style={styles.seccion}>Muro de {nombre}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {[
            { id: '1', texto: 'Andamos trabajando en el primer single, ¿Quién quiere escucharlo???', likes: 80, comentarios: 10, tiempo: 'Hace 1 día' },
            { id: '2', texto: 'Próximo toque en CLUB CLANDESTINO chicos', likes: 80, comentarios: 10, tiempo: 'Hace 1 día' },
            { id: '3', texto: 'Gracias por todo el apoyo en el último show, fue increíble!', likes: 120, comentarios: 15, tiempo: 'Hace 2 días' },
            { id: '4', texto: 'Nueva canción disponible en todas las plataformas. Escúchenla!', likes: 95, comentarios: 8, tiempo: 'Hace 3 días' },
            { id: '5', texto: 'Ensayando para el próximo toque, viene con todo!', likes: 60, comentarios: 5, tiempo: 'Hace 4 días' },
            { id: '6', texto: 'Muchas gracias a todos los que nos han apoyado desde el principio!', likes: 200, comentarios: 25, tiempo: 'Hace 5 días' },
          ].map(p => (
            <View key={p.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                {/* ✅ Imagen del artista en cada post del muro */}
                <Image source={getFotoPerfil()} style={styles.postAvatar} />
                <View>
                  <Text style={styles.postAutor}>{nombre}</Text>
                  <Text style={styles.postTiempo}>{p.tiempo}</Text>
                </View>
              </View>
              <Text style={styles.postTexto}>{p.texto}</Text>
              <View style={styles.postFooter}>
                <Text style={styles.postLike}>❤ {p.likes}</Text>
                <Text style={styles.postComentario}>💬 {p.comentarios}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  topSection: { alignItems: 'center', marginBottom: 8, width: '100%' },
  fotoPerfil: { width: 140, height: 140, borderRadius: 70, marginBottom: 16 },
  nombre: { color: Colors.text, fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  badgesRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 },
  badgeMusico: { backgroundColor: '#FFD600', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 4 },
  badgeColaborador: { backgroundColor: '#A47EDE', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 4 },
  badgeText: { color: Colors.background, fontWeight: '700', fontSize: 12 },
  bio: { color: Colors.textMuted, textAlign: 'center', fontSize: 13, marginBottom: 16, lineHeight: 20 },
  botonesRow: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  btnMensaje: { borderWidth: 1, borderColor: Colors.text, borderRadius: 20, paddingHorizontal: 32, paddingVertical: 10 },
  btnMensajeText: { color: Colors.text, fontWeight: '600' },
  btnSeguir: { borderWidth: 1, borderColor: Colors.text, borderRadius: 20, paddingHorizontal: 32, paddingVertical: 10 },
  btnSiguiendo: { backgroundColor: Colors.text, borderColor: Colors.text },
  btnSeguirText: { color: Colors.text, fontWeight: '600' },
  btnSiguiendoText: { color: Colors.background },
  seccion: { color: Colors.text, fontSize: 18, fontWeight: '900', marginBottom: 12, marginTop: 16 },
  gridCanciones: { flexDirection: 'row', gap: 8 },
  columna: { flexDirection: 'column', gap: 8 },
  cancionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: 8, padding: 10, gap: 8, width: 180 },
  cancionImg: { width: 40, height: 40, borderRadius: 6 },
  cancionTitulo: { color: Colors.text, fontWeight: '600', fontSize: 12 },
  cancionArtista: { color: Colors.textMuted, fontSize: 10 },
  puntos: { color: Colors.textMuted, fontSize: 16 },
  verificacionCard: { backgroundColor: Colors.card, borderRadius: 10, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  verificacionTitulo: { color: Colors.text, fontWeight: '700' },
  verificacionSub: { color: Colors.textMuted, fontWeight: '400', fontSize: 12 },
  activoBadge: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  activoText: { color: Colors.background, fontWeight: '700', fontSize: 12 },
  postCard: { backgroundColor: Colors.card, borderRadius: 10, padding: 12, width: 150, marginRight: 12, minHeight: 200 },
  postHeader: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 },
  postAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.border },
  postAutor: { color: Colors.text, fontWeight: '700', fontSize: 12 },
  postTiempo: { color: Colors.textMuted, fontSize: 10 },
  postTexto: { color: Colors.text, fontSize: 12, marginBottom: 8 },
  postFooter: { flexDirection: 'row', gap: 12 },
  postLike: { color: Colors.textMuted, fontSize: 12 },
  postComentario: { color: Colors.textMuted, fontSize: 12 },
});