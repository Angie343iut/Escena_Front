import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput, Image,
  Modal, Alert, Platform
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Colors } from '../constants/colors';
import Header from '../components/Header';

const imgIndie = require('../assets/saikoro.png');
const imgRock = require('../assets/k93.png');
const imgTrap = require('../assets/mgk.jpg');
const imgMetal = require('../assets/joost.png');

const imgForo1 = require('../assets/foro1tocando.jpg');
const imgForo2 = require('../assets/foro2tocando.jpg');
const audioVampira = require('../assets/vampira_911.mp3');
const audioLolito = require('../assets/lolitossinclair.mp3');

const foros = [
  { id: '1', nombre: '#indie', imagen: imgIndie },
  { id: '2', nombre: '#rock', imagen: imgRock },
  { id: '3', nombre: '#trap', imagen: imgTrap },
  { id: '4', nombre: '#metal', imagen: imgMetal },
];

const forosOlvidados = [
  { id: '5', nombre: '#jazz', imagen: imgIndie },
  { id: '6', nombre: '#punk', imagen: imgRock },
  { id: '7', nombre: '#reggae', imagen: imgTrap },
  { id: '8', nombre: '#hiphop', imagen: imgMetal },
  { id: '9', nombre: '#folk', imagen: imgIndie },
  { id: '10', nombre: '#emo', imagen: imgRock },
];

const postsPorForo = {
  '#indie': [
    { id: '1', autor: 'Sin Valor', tiempo: 'Hace 2 min · Bogotá', contenido: 'Nueva canción muchachos! Escúchenla a ver que opinan, denle like si quieren que la saquemos en plataformas. Nos vemos este viernes!', tipo: 'audio', audio: audioVampira, audioNombre: 'Vampira 911 - Preview', likes: 21, comentarios: [
      { id: '1', autor: 'Julian', rol: 'Oyente', texto: 'Parce porfinnnn llevo esperando como 3 meses' },
      { id: '2', autor: 'Lulu', rol: 'Oyente', texto: 'OOOOOOOOO' },
      { id: '3', autor: 'Angie', rol: 'Músico', texto: 'Mk está increíble' },
      { id: '4', autor: 'Juan', rol: 'Oyente', texto: 'Cuando tiene planeado el release??' },
    ]},
    { id: '2', autor: 'Nico y los Tellibles', tiempo: 'Hace 5 min · Bogotá', contenido: 'Nico y los Tellibles llegan este sábado con un toque cargado de ruido, energía y cero filtros.', tipo: 'imagen', imagen: imgForo1, likes: 15, comentarios: [] },
    { id: '3', autor: 'Saikoro!', tiempo: 'Hace 10 min · Medellín', contenido: 'Nuevo EP disponible en todas las plataformas. Escúchenlo y dígannos qué piensan!', tipo: 'audio', audio: audioLolito, audioNombre: 'Lolito Sinclair - Preview', likes: 34, comentarios: [] },
    { id: '4', autor: 'La Herencia', tiempo: 'Hace 20 min · Cali', contenido: '¿Alguien más está yendo al festival este fin de semana? Los vemos allá!', tipo: 'imagen', imagen: imgForo2, likes: 8, comentarios: [] },
    { id: '5', autor: 'Juan García', tiempo: 'Hace 1 hora · Bogotá', contenido: 'Recomendaciones de bandas indie colombianas que no se pueden perder este año.', likes: 45, comentarios: [] },
    { id: '6', autor: 'María López', tiempo: 'Hace 2 horas · Medellín', contenido: 'Busco músicos para armar una banda de indie-rock en Medellín. DM si están interesados!', likes: 12, comentarios: [] },
  ],
  '#rock': [
    { id: '1', autor: 'K93', tiempo: 'Hace 1 min · Bogotá', contenido: 'El rock colombiano está más vivo que nunca. Próximo toque el 2 de mayo!', likes: 50, comentarios: [] },
    { id: '2', autor: 'Los Aterciopelados', tiempo: 'Hace 15 min · Bogotá', contenido: 'Nuevo single disponible. El rock nunca muere!', likes: 80, comentarios: [] },
    { id: '3', autor: 'Pedro Suárez', tiempo: 'Hace 30 min · Cali', contenido: 'Alguien más escuchando el nuevo álbum de rock nacional?', likes: 22, comentarios: [] },
    { id: '4', autor: 'Rock Club', tiempo: 'Hace 1 hora · Bogotá', contenido: 'Evento de rock en el Parque de la 93 este domingo. Entrada libre!', likes: 95, comentarios: [] },
    { id: '5', autor: 'Ana Ruiz', tiempo: 'Hace 2 horas · Medellín', contenido: 'Top 10 riffs de guitarra del rock colombiano según ustedes?', likes: 67, comentarios: [] },
    { id: '6', autor: 'El Cuarteto', tiempo: 'Hace 3 horas · Barranquilla', contenido: 'Grabando nuevo material en el estudio. Pronto noticias!', likes: 33, comentarios: [] },
  ],
  '#trap': [
    { id: '1', autor: 'DJ Smoke', tiempo: 'Hace 3 min · Bogotá', contenido: 'Nueva sesión de trap disponible en SoundCloud. Denle play!', likes: 40, comentarios: [] },
    { id: '2', autor: 'Young Killa', tiempo: 'Hace 10 min · Medellín', contenido: 'El trap colombiano está pegando fuerte en Latinoamérica.', likes: 55, comentarios: [] },
    { id: '3', autor: 'Trap House', tiempo: 'Hace 25 min · Bogotá', contenido: 'Cypher este viernes en el centro. Todos bienvenidos!', likes: 30, comentarios: [] },
    { id: '4', autor: 'La Doble T', tiempo: 'Hace 45 min · Cali', contenido: 'Beats disponibles para artistas. DM para info.', likes: 18, comentarios: [] },
    { id: '5', autor: 'Mike Flow', tiempo: 'Hace 1 hora · Bogotá', contenido: 'Nuevo video ya en YouTube. Compartan!', likes: 72, comentarios: [] },
    { id: '6', autor: 'Trap Colombia', tiempo: 'Hace 2 horas · Medellín', contenido: 'Quién es el mejor trapero colombiano del momento?', likes: 100, comentarios: [] },
  ],
  '#metal': [
    { id: '1', autor: 'Kraken', tiempo: 'Hace 5 min · Bogotá', contenido: 'El metal colombiano tiene historia. Recordemos las bandas clásicas!', likes: 45, comentarios: [] },
    { id: '2', autor: 'Dark Fest', tiempo: 'Hace 20 min · Medellín', contenido: 'Festival de metal en Medellín próximo mes. Info en el link!', likes: 88, comentarios: [] },
    { id: '3', autor: 'Metal Head', tiempo: 'Hace 35 min · Bogotá', contenido: 'Busco bajista para banda de death metal. Serios interesados.', likes: 15, comentarios: [] },
    { id: '4', autor: 'Zona Metal', tiempo: 'Hace 50 min · Cali', contenido: 'Top riffs de guitarra metal colombiana. Aporten!', likes: 60, comentarios: [] },
    { id: '5', autor: 'Black Storm', tiempo: 'Hace 1 hora · Bogotá', contenido: 'Nuevo álbum grabado completamente en análogo. Próximamente!', likes: 35, comentarios: [] },
    { id: '6', autor: 'Metal Club', tiempo: 'Hace 2 horas · Medellín', contenido: 'Jam session de metal este sábado. Traigan sus instrumentos!', likes: 50, comentarios: [] },
  ],
  '#jazz': [
    { id: '1', autor: 'Jazz Club Bogotá', tiempo: 'Hace 10 min · Bogotá', contenido: 'Sesión de jazz en vivo este jueves. Entrada libre desde las 8pm!', likes: 30, comentarios: [] },
    { id: '2', autor: 'Laura Pérez', tiempo: 'Hace 30 min · Medellín', contenido: 'El jazz colombiano merece más reconocimiento. Qué piensan?', likes: 25, comentarios: [] },
    { id: '3', autor: 'Trio Moderno', tiempo: 'Hace 1 hora · Bogotá', contenido: 'Nuevo álbum de jazz fusión disponible en Spotify!', likes: 40, comentarios: [] },
    { id: '4', autor: 'Carlos Vives Jr', tiempo: 'Hace 2 horas · Barranquilla', contenido: 'Fusionando jazz con vallenato. Resultados increíbles!', likes: 55, comentarios: [] },
    { id: '5', autor: 'Jazz Fest', tiempo: 'Hace 3 horas · Bogotá', contenido: 'Festival de jazz próximo mes. Artistas nacionales e internacionales!', likes: 70, comentarios: [] },
    { id: '6', autor: 'Mario Galeano', tiempo: 'Hace 4 horas · Bogotá', contenido: 'Improvisación libre esta noche en el Teatro Libre.', likes: 20, comentarios: [] },
  ],
  '#punk': [
    { id: '1', autor: 'Los Rebeldes', tiempo: 'Hace 5 min · Bogotá', contenido: 'El punk no ha muerto. Toque este viernes en el Bunker!', likes: 35, comentarios: [] },
    { id: '2', autor: 'Punk Colombia', tiempo: 'Hace 20 min · Medellín', contenido: 'Recordando los inicios del punk en Colombia. Comparten sus historias?', likes: 28, comentarios: [] },
    { id: '3', autor: 'La Brigada', tiempo: 'Hace 40 min · Cali', contenido: 'Nuevo single grabado en vivo. Sin edición, sin filtros!', likes: 45, comentarios: [] },
    { id: '4', autor: 'Anarchy Club', tiempo: 'Hace 1 hora · Bogotá', contenido: 'Compilado de bandas punk colombianas disponible gratis.', likes: 60, comentarios: [] },
    { id: '5', autor: 'Distorsión', tiempo: 'Hace 2 horas · Medellín', contenido: 'Ensayo abierto este sábado. Vengan a ver cómo creamos música!', likes: 22, comentarios: [] },
    { id: '6', autor: 'Los Clash', tiempo: 'Hace 3 horas · Bogotá', contenido: 'Buscamos vocalista para banda de punk. Serios interesados!', likes: 18, comentarios: [] },
  ],
  '#reggae': [
    { id: '1', autor: 'Reggae Colombia', tiempo: 'Hace 8 min · Bogotá', contenido: 'El reggae colombiano tiene raíces profundas. Celebrémoslas!', likes: 42, comentarios: [] },
    { id: '2', autor: 'Irie Vibrations', tiempo: 'Hace 25 min · Medellín', contenido: 'Nuevo EP de reggae roots disponible. Paz y amor!', likes: 38, comentarios: [] },
    { id: '3', autor: 'Rasta Fest', tiempo: 'Hace 45 min · Cali', contenido: 'Festival de reggae este fin de semana. All are welcome!', likes: 65, comentarios: [] },
    { id: '4', autor: 'One Love', tiempo: 'Hace 1 hora · Bogotá', contenido: 'Sesión de dub en vivo esta noche. Entrada libre!', likes: 30, comentarios: [] },
    { id: '5', autor: 'Jah Bless', tiempo: 'Hace 2 horas · Barranquilla', contenido: 'Fusión de reggae con cumbia. Algo increíble está naciendo!', likes: 55, comentarios: [] },
    { id: '6', autor: 'Sound System', tiempo: 'Hace 3 horas · Bogotá', contenido: 'Sound system party este sábado. Trae tu energía positiva!', likes: 48, comentarios: [] },
  ],
  '#hiphop': [
    { id: '1', autor: 'Hip Hop Colombia', tiempo: 'Hace 4 min · Bogotá', contenido: 'El hip hop colombiano está en su mejor momento. Representando!', likes: 75, comentarios: [] },
    { id: '2', autor: 'MC Bogotá', tiempo: 'Hace 18 min · Bogotá', contenido: 'Freestyle session este miércoles en la Plaza de Bolívar!', likes: 90, comentarios: [] },
    { id: '3', autor: 'Break Dance Crew', tiempo: 'Hace 35 min · Medellín', contenido: 'Batalla de break dance este sábado. Inscripciones abiertas!', likes: 60, comentarios: [] },
    { id: '4', autor: 'Graffiti Art', tiempo: 'Hace 50 min · Cali', contenido: 'Nuevo mural de hip hop en el barrio. Vengan a verlo!', likes: 45, comentarios: [] },
    { id: '5', autor: 'Rap Nacional', tiempo: 'Hace 1 hora · Bogotá', contenido: 'Compilado de rap colombiano 2024. Más de 50 artistas!', likes: 110, comentarios: [] },
    { id: '6', autor: 'La Clave', tiempo: 'Hace 2 horas · Medellín', contenido: 'Nuevo álbum conceptual sobre la ciudad. Próximamente!', likes: 35, comentarios: [] },
  ],
  '#folk': [
    { id: '1', autor: 'Folk Colombia', tiempo: 'Hace 12 min · Bogotá', contenido: 'La música folk colombiana es un tesoro cultural. Preservémosla!', likes: 32, comentarios: [] },
    { id: '2', autor: 'Voz del Campo', tiempo: 'Hace 28 min · Medellín', contenido: 'Nuevo álbum de folk andino disponible en todas las plataformas!', likes: 28, comentarios: [] },
    { id: '3', autor: 'Raíces Fest', tiempo: 'Hace 45 min · Bogotá', contenido: 'Festival de música tradicional este fin de semana. Entrada libre!', likes: 50, comentarios: [] },
    { id: '4', autor: 'Cuerdas del Alma', tiempo: 'Hace 1 hora · Cali', contenido: 'Taller de guitarra folk este sábado. Cupos limitados!', likes: 20, comentarios: [] },
    { id: '5', autor: 'El Trovador', tiempo: 'Hace 2 horas · Bogotá', contenido: 'Composición nueva inspirada en los Llanos Orientales.', likes: 38, comentarios: [] },
    { id: '6', autor: 'Tierra y Voz', tiempo: 'Hace 3 horas · Medellín', contenido: 'Fusión de folk con electrónica. Algo diferente viene!', likes: 25, comentarios: [] },
  ],
  '#emo': [
    { id: '1', autor: 'Emo Colombia', tiempo: 'Hace 6 min · Bogotá', contenido: 'El emo nunca murió. Seguimos acá con las mismas heridas jaja!', likes: 55, comentarios: [] },
    { id: '2', autor: 'Black Parade', tiempo: 'Hace 22 min · Medellín', contenido: 'Noche emo este viernes. Trae tu eyeliner y tus feelz!', likes: 70, comentarios: [] },
    { id: '3', autor: 'Corazón Roto', tiempo: 'Hace 40 min · Bogotá', contenido: 'Nuevo EP de post-emo disponible. Lloren con nosotros!', likes: 45, comentarios: [] },
    { id: '4', autor: 'Scene Kids', tiempo: 'Hace 1 hora · Cali', contenido: 'Alguien más creció escuchando MCR y siente que los salvó?', likes: 100, comentarios: [] },
    { id: '5', autor: 'Lágrimas de Tinta', tiempo: 'Hace 2 horas · Bogotá', contenido: 'Cover de Welcome to the Black Parade en vivo. Denle amor!', likes: 80, comentarios: [] },
    { id: '6', autor: 'Forever Emo', tiempo: 'Hace 3 horas · Medellín', contenido: 'Buscamos baterista para banda de emo. Serios interesados!', likes: 30, comentarios: [] },
  ],
};

function AudioPlayer({ source, nombre }) {
  const soundRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const barWidthRef = useRef(200);

  useEffect(() => {
    let sound;
    (async () => {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound: s } = await Audio.Sound.createAsync(source, { shouldPlay: false }, (status) => {
        if (status.isLoaded) {
          const dur = status.durationMillis;
          if (dur && isFinite(dur) && dur > 0) setDuration(dur);
          const pos = status.positionMillis;
          if (pos != null && isFinite(pos)) setPosition(pos);
          if (status.didJustFinish) { setPlaying(false); setPosition(0); }
        }
      });
      sound = s;
      soundRef.current = s;
    })();
    return () => { sound?.unloadAsync(); };
  }, []);

  const togglePlay = async () => {
    if (!soundRef.current) return;
    if (playing) { await soundRef.current.pauseAsync(); setPlaying(false); }
    else { await soundRef.current.playAsync(); setPlaying(true); }
  };

  const handleBarPress = async (e) => {
    if (!soundRef.current) return;
    const dur = duration;
    if (!dur || dur <= 0 || !isFinite(dur)) return;
    const x = e.nativeEvent?.locationX;
    if (x == null || !isFinite(x)) return;
    const w = barWidthRef.current;
    if (!w || w <= 0) return;
    const ratio = Math.max(0, Math.min(x / w, 1));
    const newPos = Math.round(ratio * dur);
    if (!isFinite(newPos) || newPos < 0) return;
    setPosition(newPos);
    try { await soundRef.current.setPositionAsync(newPos); } catch (err) { console.warn('seek error:', err); }
  };

  const formatTime = (ms) => {
    if (!ms || ms <= 0) return '0:00';
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={audioStyles.container}>
      <View style={audioStyles.progressBg}
        onLayout={(e) => { barWidthRef.current = e.nativeEvent.layout.width; }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(e) => handleBarPress(e)}
        onResponderMove={(e) => handleBarPress(e)}
      >
        <View style={audioStyles.progressTrack} />
        <View style={[audioStyles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={audioStyles.times}>
        <Text style={audioStyles.timeText}>{formatTime(position)}</Text>
        <Text style={audioStyles.nombre} numberOfLines={1}>{nombre}</Text>
        <Text style={audioStyles.timeText}>{formatTime(duration)}</Text>
      </View>
      <View style={audioStyles.controls}>
        <TouchableOpacity onPress={togglePlay} style={audioStyles.playBtn}>
          <Text style={audioStyles.playIcon}>{playing ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const audioStyles = StyleSheet.create({
  container: { backgroundColor: '#1A1A1A', borderRadius: 10, padding: 10, marginTop: 10, marginBottom: 4 },
  progressBg: { height: 18, justifyContent: 'center', marginBottom: 4 },
  progressTrack: { position: 'absolute', left: 0, right: 0, height: 4, backgroundColor: '#444', borderRadius: 2 },
  progressFill: { position: 'absolute', left: 0, height: 4, backgroundColor: Colors.primary, borderRadius: 2 },
  times: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  timeText: { color: Colors.textMuted, fontSize: 10 },
  nombre: { color: Colors.text, fontSize: 11, fontWeight: '600', flex: 1, textAlign: 'center', marginHorizontal: 4 },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  playBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  playIcon: { fontSize: 16, color: Colors.background },
});

function PostCard({ p, onVerComentarios }) {
  const [liked, setLiked] = useState(false);
  const [faved, setFaved] = useState(false);
  const [likesCount, setLikesCount] = useState(p.likes);

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.postAutor}>{p.autor}</Text>
          <Text style={styles.postTiempo}>{p.tiempo}</Text>
        </View>
      </View>
      <Text style={styles.postContenido}>{p.contenido}</Text>
      {p.tipo === 'audio' && <AudioPlayer source={p.audio} nombre={p.audioNombre} />}
      {p.tipo === 'imagen' && <Image source={p.imagen} style={styles.postImagen} resizeMode="cover" />}
      <View style={styles.postFooter}>
        <TouchableOpacity onPress={() => { setLikesCount(liked ? likesCount - 1 : likesCount + 1); setLiked(!liked); }}>
          <Text style={[styles.postLike, liked && styles.likeActivo]}>❤ {likesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onVerComentarios(p)}>
          <Text style={styles.postComentario}>💬 {p.comentarios.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFaved(!faved)} style={{ marginLeft: 'auto' }}>
          <Text style={[styles.postFav, faved && styles.favActivo]}>{faved ? '★' : '☆'} Fav</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ComentariosScreen({ post, foro, onBack }) {
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState(post.comentarios);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
  };

  const enviar = () => {
    if (!comentario.trim()) return;
    const nuevo = { id: Date.now().toString(), autor: 'Tú', rol: 'Oyente', texto: comentario };
    setComentarios([...comentarios, nuevo]);
    setComentario('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.foroTag}>{foro?.toUpperCase()}</Text>
        <Text style={styles.seccionLabel}>POST</Text>
        <View style={styles.postCardDetalle}>
          <View style={styles.postHeaderDetalle}>
            <View style={styles.avatarGrande} />
            <View>
              <Text style={styles.postAutor}>{post.autor}</Text>
              <Text style={styles.postTiempo}>{post.tiempo}</Text>
            </View>
          </View>
          <Text style={styles.postContenido}>{post.contenido}</Text>
          {post.tipo === 'audio' && <AudioPlayer source={post.audio} nombre={post.audioNombre} />}
          {post.tipo === 'imagen' && <Image source={post.imagen} style={styles.postImagen} resizeMode="cover" />}
          <View style={styles.postFooter}>
            <TouchableOpacity onPress={() => { setLikesCount(liked ? likesCount - 1 : likesCount + 1); setLiked(!liked); }}>
              <Text style={[styles.postLike, liked && styles.likeActivo]}>❤ {likesCount}</Text>
            </TouchableOpacity>
            <Text style={styles.postComentario}>💬 {comentarios.length}</Text>
          </View>
        </View>
        <Text style={styles.seccionLabel}>COMENTARIOS</Text>
        {comentarios.length === 0 && <Text style={styles.sinComentarios}>Sé el primero en comentar!</Text>}
        {comentarios.map(c => (
          <View key={c.id} style={styles.comentarioCard}>
            <View style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <View style={styles.comentarioHeader}>
                <Text style={styles.comentarioAutor}>{c.autor}</Text>
                <View style={styles.rolBadge}><Text style={styles.rolText}>{c.rol}</Text></View>
              </View>
              <Text style={styles.comentarioTexto}>{c.texto}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder="Escribe un comentario..." placeholderTextColor={Colors.textMuted} value={comentario} onChangeText={setComentario} onSubmitEditing={enviar} returnKeyType="send" />
        <TouchableOpacity style={styles.adjuntarIconBtn} onPress={pickImage}>
          <Ionicons name="image-outline" size={22} color={Colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.enviarBtn} onPress={enviar}>
          <Ionicons name="arrow-up" size={18} color={Colors.background} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function NuevoPostModal({ visible, foro, onClose, onPublicar }) {
  const [texto, setTexto] = useState('');
  const [imagen, setImagen] = useState(null);
  const [audio, setAudio] = useState(null);

  const reset = () => { setTexto(''); setImagen(null); setAudio(null); };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled && result.assets?.[0]) { setImagen({ uri: result.assets[0].uri }); setAudio(null); }
  };

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*', copyToCacheDirectory: true });
      if (!result.canceled && result.assets?.[0]) { setAudio({ uri: result.assets[0].uri, nombre: result.assets[0].name }); setImagen(null); }
    } catch (e) { Alert.alert('Error', 'No se pudo seleccionar el audio.'); }
  };

  const publicar = () => {
    if (!texto.trim() && !imagen && !audio) { Alert.alert('Vacío', 'Escribe algo o adjunta un archivo.'); return; }
    const nuevoPost = {
      id: Date.now().toString(), autor: 'Tú', tiempo: 'Ahora · Bogotá', contenido: texto.trim(), likes: 0, comentarios: [],
      ...(imagen ? { tipo: 'imagen', imagen: { uri: imagen.uri } } : {}),
      ...(audio ? { tipo: 'audio', audio: { uri: audio.uri }, audioNombre: audio.nombre } : {}),
      ...(!imagen && !audio ? { tipo: 'texto' } : {}),
    };
    onPublicar(nuevoPost);
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          <View style={modalStyles.sheetHeader}>
            <TouchableOpacity onPress={() => { reset(); onClose(); }}>
              <Text style={modalStyles.cancelBtn}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={modalStyles.sheetTitle}>Nuevo post en {foro}</Text>
            <TouchableOpacity onPress={publicar} style={modalStyles.pubBtn}>
              <Text style={modalStyles.pubBtnText}>Publicar</Text>
            </TouchableOpacity>
          </View>
          <TextInput style={modalStyles.textInput} placeholder="¿Qué quieres compartir?" placeholderTextColor={Colors.textMuted} value={texto} onChangeText={setTexto} multiline maxLength={500} />
          {imagen && (
            <View style={modalStyles.previewRow}>
              <Image source={{ uri: imagen.uri }} style={modalStyles.previewImg} />
              <TouchableOpacity onPress={() => setImagen(null)} style={modalStyles.removeBtn}>
                <Text style={modalStyles.removeX}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          {audio && (
            <View style={modalStyles.audioPreview}>
              <Ionicons name="musical-note" size={22} color={Colors.primary} />
              <Text style={modalStyles.audioPreviewNombre} numberOfLines={1}>{audio.nombre}</Text>
              <TouchableOpacity onPress={() => setAudio(null)} style={modalStyles.removeBtn}>
                <Text style={modalStyles.removeX}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={modalStyles.adjuntarRow}>
            <TouchableOpacity style={modalStyles.adjuntarBtn} onPress={pickImage}>
              <Ionicons name="image-outline" size={20} color={Colors.text} />
              <Text style={modalStyles.adjuntarLabel}>Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.adjuntarBtn} onPress={pickAudio}>
              <Ionicons name="musical-note-outline" size={20} color={Colors.text} />
              <Text style={modalStyles.adjuntarLabel}>Audio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, paddingBottom: 40 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cancelBtn: { color: Colors.textMuted, fontSize: 14 },
  sheetTitle: { color: Colors.text, fontWeight: '700', fontSize: 15 },
  pubBtn: { backgroundColor: Colors.primary, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 6 },
  pubBtnText: { color: Colors.background, fontWeight: '800', fontSize: 13 },
  textInput: { color: Colors.text, fontSize: 14, minHeight: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 12, marginBottom: 12 },
  previewRow: { position: 'relative', marginBottom: 12 },
  previewImg: { width: '100%', height: 160, borderRadius: 10 },
  audioPreview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 10, padding: 10, marginBottom: 12, gap: 8 },
  audioPreviewNombre: { flex: 1, color: Colors.text, fontSize: 13 },
  removeBtn: { padding: 4 },
  removeX: { color: Colors.textMuted, fontSize: 16, fontWeight: '700' },
  adjuntarRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  adjuntarBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1A1A1A', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  adjuntarLabel: { color: Colors.text, fontSize: 13, fontWeight: '600' },
});

export default function ForosScreen({ route }) {
  const [foroActivo, setForoActivo] = useState(route?.params?.foroInicial || null);
  const [postActivo, setPostActivo] = useState(null);
  const [mostrarNuevoPost, setMostrarNuevoPost] = useState(false);
  const [postsPorForoLocal, setPostsPorForoLocal] = useState(postsPorForo);

  const agregarPost = (post) => {
    setPostsPorForoLocal(prev => ({ ...prev, [foroActivo]: [post, ...(prev[foroActivo] || [])] }));
  };

  if (postActivo) {
    return <ComentariosScreen post={postActivo} foro={foroActivo} onBack={() => setPostActivo(null)} />;
  }

  if (foroActivo) {
    const posts = postsPorForoLocal[foroActivo] || [];
    return (
      <SafeAreaView style={styles.container}>
        <Header onBack={() => setForoActivo(null)} />
        <NuevoPostModal visible={mostrarNuevoPost} foro={foroActivo} onClose={() => setMostrarNuevoPost(false)} onPublicar={agregarPost} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.titulo}>{foroActivo.toUpperCase()}</Text>
          {posts.length === 0 && <Text style={styles.sinPosts}>No hay posts en este foro todavía. ¡Sé el primero!</Text>}
          {posts.map(p => <PostCard key={p.id} p={p} onVerComentarios={(post) => setPostActivo(post)} />)}
        </ScrollView>
        {/* ✅ Solo un input que abre el modal */}
        <TouchableOpacity style={styles.inputRow} activeOpacity={0.8} onPress={() => setMostrarNuevoPost(true)}>
          <View style={[styles.input, { justifyContent: 'center' }]} pointerEvents="none">
            <Text style={{ color: Colors.textMuted, fontSize: 14 }}>¿Qué quieres compartir?</Text>
          </View>
          <View style={styles.enviarBtn}>
            <Text style={{ color: Colors.background, fontWeight: '800' }}>+</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>FOROS</Text>
        <Text style={styles.subtitulo}>¡Tus Foros!</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {foros.map(f => (
            <TouchableOpacity key={f.id} style={styles.foroCard} onPress={() => setForoActivo(f.nombre)}>
              <Image source={f.imagen} style={styles.foroImg} />
              <Text style={styles.foroNombre}>{f.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.subtitulo}>Los foros más populares</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {foros.map(f => (
            <TouchableOpacity key={`pop-${f.id}`} style={styles.foroCard} onPress={() => setForoActivo(f.nombre)}>
              <Image source={f.imagen} style={styles.foroImg} />
              <Text style={styles.foroNombre}>{f.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.subtitulo}>¡Descubre nuevos foros!</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {foros.map(f => (
            <TouchableOpacity key={`new-${f.id}`} style={styles.foroCard} onPress={() => setForoActivo(f.nombre)}>
              <Image source={f.imagen} style={styles.foroImg} />
              <Text style={styles.foroNombre}>{f.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.subtitulo}>Foros que tienes olvidados...</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {forosOlvidados.map(f => (
            <TouchableOpacity key={`old-${f.id}`} style={styles.foroCard} onPress={() => setForoActivo(f.nombre)}>
              <Image source={f.imagen} style={styles.foroImg} />
              <Text style={styles.foroNombre}>{f.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  titulo: { color: Colors.text, fontSize: 28, fontWeight: '900', marginBottom: 0 },
  subtitulo: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 10 },
  foroTag: { color: Colors.primary, fontSize: 22, fontWeight: '900', marginBottom: 4 },
  seccionLabel: { color: Colors.text, fontSize: 13, fontWeight: '900', letterSpacing: 2, marginBottom: 10, marginTop: 8 },
  foroCard: { alignItems: 'center', marginRight: 16 },
  foroImg: { width: 140, height: 100, borderRadius: 10, marginBottom: 6 },
  foroNombre: { color: Colors.text, fontSize: 13, fontWeight: '600' },
  sinPosts: { color: Colors.textMuted, textAlign: 'center', marginTop: 40, fontSize: 14 },
  sinComentarios: { color: Colors.textMuted, textAlign: 'center', marginTop: 20, marginBottom: 20, fontSize: 14 },
  postCard: { backgroundColor: Colors.card, borderRadius: 12, padding: 14, marginBottom: 14 },
  postCardDetalle: { backgroundColor: Colors.card, borderRadius: 12, padding: 14, marginBottom: 16 },
  postHeader: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 10 },
  postHeaderDetalle: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.border },
  avatarGrande: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.border },
  postAutor: { color: Colors.text, fontWeight: '700', fontSize: 14 },
  postTiempo: { color: Colors.textMuted, fontSize: 11 },
  postContenido: { color: Colors.text, fontSize: 13, lineHeight: 20, marginBottom: 10 },
  postImagen: { width: '100%', height: 180, borderRadius: 10, marginTop: 4, marginBottom: 10 },
  postFooter: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 10 },
  postLike: { color: Colors.textMuted, fontSize: 13 },
  likeActivo: { color: '#FF3B30' },
  postComentario: { color: Colors.textMuted, fontSize: 13 },
  postFav: { color: Colors.textMuted, fontSize: 13 },
  favActivo: { color: '#FFD600', fontWeight: '900' },
  comentarioCard: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  comentarioHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  comentarioAutor: { color: Colors.text, fontWeight: '700', fontSize: 13 },
  rolBadge: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  rolText: { color: Colors.background, fontSize: 10, fontWeight: '700' },
  comentarioTexto: { color: Colors.text, fontSize: 13, lineHeight: 18 },
  inputRow: { flexDirection: 'row', gap: 8, padding: 16, borderTopWidth: 1, borderTopColor: Colors.border },
  input: { flex: 1, backgroundColor: '#1A1A1A', color: Colors.text, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: Colors.border },
  enviarBtn: { backgroundColor: Colors.primary, borderRadius: 22, width: 42, height: 42, justifyContent: 'center', alignItems: 'center' },
  adjuntarIconBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  previewBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.card },
  previewThumb: { width: 48, height: 48, borderRadius: 6 },
  previewAudioNombre: { flex: 1, color: Colors.text, fontSize: 12 },
  previewRemove: { padding: 2 },
});