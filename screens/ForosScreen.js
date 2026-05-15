import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Colors } from '../constants/colors';
import Header from '../components/Header';
import { API_URL } from '../api/api';

const imgIndie = require('../assets/saikoro.png');
const imgRock = require('../assets/k93.png');
const imgTrap = require('../assets/mgk.jpg');
const imgMetal = require('../assets/joost.png');

const imgForo1 = require('../assets/foro1tocando.jpg');
const imgForo2 = require('../assets/foro2tocando.jpg');

const imgSinValor = require('../assets/foto_artista.png');
const imgLuci = require('../assets/luci.png');
const imgLuisJ = require('../assets/luisj_intercambios.png');
const imgJose = require('../assets/jose_intercambios.png');
const imgMarianaG = require('../assets/marianag.jpg');
const imgElKraken = require('../assets/elkraken.jpg');
const imgSofiaM = require('../assets/sofiam.jpg');

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
    {
      id: 'local-indie-1',
      autor: 'Sin Valor',
      rol: 'Músico',
      tiempo: 'Hace 2 min · Bogotá',
      contenido: 'Nueva canción muchachos! Escúchenla a ver que opinan, denle like si quieren que la saquemos en plataformas. Nos vemos este viernes!',
      tipo: 'audio',
      audio: audioVampira,
      audioNombre: 'Vampira 911 - Preview',
      likes: 21,
      comentarios: [
        { id: '1', autor: 'Julian', rol: 'Oyente', texto: 'Parce porfinnnn llevo esperando como 3 meses' },
        { id: '2', autor: 'Lulu', rol: 'Oyente', texto: 'OOOOOOOOO' },
        { id: '3', autor: 'Angie', rol: 'Músico', texto: 'Mk está increíble' },
        { id: '4', autor: 'Juan', rol: 'Oyente', texto: 'Cuando tiene planeado el release??' },
      ],
    },
    {
      id: 'local-indie-2',
      autor: 'Nico y los Tellibles',
      rol: 'Músico',
      tiempo: 'Hace 5 min · Bogotá',
      contenido: 'Nico y los Tellibles llegan este sábado con un toque cargado de ruido, energía y cero filtros.',
      tipo: 'imagen',
      imagen: imgForo1,
      likes: 15,
      comentarios: [],
    },
    {
      id: 'local-indie-3',
      autor: 'Saikoro!',
      rol: 'Músico',
      tiempo: 'Hace 10 min · Medellín',
      contenido: 'Nuevo EP disponible en todas las plataformas. Escúchenlo y dígannos qué piensan!',
      tipo: 'audio',
      audio: audioLolito,
      audioNombre: 'Lolito Sinclair - Preview',
      likes: 34,
      comentarios: [],
    },
    {
      id: 'local-indie-4',
      autor: 'La Herencia',
      rol: 'Músico',
      tiempo: 'Hace 20 min · Cali',
      contenido: '¿Alguien más está yendo al festival este fin de semana? Los vemos allá!',
      tipo: 'imagen',
      imagen: imgForo2,
      likes: 8,
      comentarios: [],
    },
    {
      id: 'local-indie-5',
      autor: 'Juan García',
      rol: 'Oyente',
      tiempo: 'Hace 1 hora · Bogotá',
      contenido: 'Recomendaciones de bandas indie colombianas que no se pueden perder este año.',
      tipo: 'texto',
      likes: 45,
      comentarios: [],
    },
    {
      id: 'local-indie-6',
      autor: 'María López',
      rol: 'Músico',
      tiempo: 'Hace 2 horas · Medellín',
      contenido: 'Busco músicos para armar una banda de indie-rock en Medellín. DM si están interesados!',
      tipo: 'texto',
      likes: 12,
      comentarios: [],
    },
  ],
  '#rock': [
    {
      id: 'local-rock-1',
      autor: 'K93',
      rol: 'Músico',
      tiempo: 'Hace 1 min · Bogotá',
      contenido: 'El rock colombiano está más vivo que nunca. Próximo toque el 2 de mayo!',
      tipo: 'imagen',
      imagen: imgForo2,
      likes: 50,
      comentarios: [],
    },
    {
      id: 'local-rock-2',
      autor: 'Los Aterciopelados',
      rol: 'Músico',
      tiempo: 'Hace 15 min · Bogotá',
      contenido: 'Nuevo single disponible. El rock nunca muere!',
      tipo: 'audio',
      audio: audioVampira,
      audioNombre: 'Rock nacional - Preview',
      likes: 80,
      comentarios: [],
    },
    {
      id: 'local-rock-3',
      autor: 'Pedro Suárez',
      rol: 'Oyente',
      tiempo: 'Hace 30 min · Cali',
      contenido: 'Alguien más escuchando el nuevo álbum de rock nacional?',
      tipo: 'texto',
      likes: 22,
      comentarios: [],
    },
    {
      id: 'local-rock-4',
      autor: 'Rock Club',
      rol: 'Músico',
      tiempo: 'Hace 1 hora · Bogotá',
      contenido: 'Evento de rock en el Parque de la 93 este domingo. Entrada libre!',
      tipo: 'imagen',
      imagen: imgForo1,
      likes: 95,
      comentarios: [],
    },
    {
      id: 'local-rock-5',
      autor: 'Ana Ruiz',
      rol: 'Oyente',
      tiempo: 'Hace 2 horas · Medellín',
      contenido: 'Top 10 riffs de guitarra del rock colombiano según ustedes?',
      tipo: 'texto',
      likes: 67,
      comentarios: [],
    },
    {
      id: 'local-rock-6',
      autor: 'El Cuarteto',
      rol: 'Músico',
      tiempo: 'Hace 3 horas · Barranquilla',
      contenido: 'Grabando nuevo material en el estudio. Pronto noticias!',
      tipo: 'imagen',
      imagen: imgForo2,
      likes: 33,
      comentarios: [],
    },
  ],
  '#trap': [
    {
      id: 'local-trap-1',
      autor: 'DJ Smoke',
      rol: 'Músico',
      tiempo: 'Hace 3 min · Bogotá',
      contenido: 'Nueva sesión de trap disponible en SoundCloud. Denle play!',
      tipo: 'audio',
      audio: audioLolito,
      audioNombre: 'Trap session - Preview',
      likes: 40,
      comentarios: [],
    },
    {
      id: 'local-trap-2',
      autor: 'Young Killa',
      rol: 'Músico',
      tiempo: 'Hace 10 min · Medellín',
      contenido: 'El trap colombiano está pegando fuerte en Latinoamérica.',
      tipo: 'imagen',
      imagen: imgForo1,
      likes: 55,
      comentarios: [],
    },
    {
      id: 'local-trap-3',
      autor: 'Trap House',
      rol: 'Músico',
      tiempo: 'Hace 25 min · Bogotá',
      contenido: 'Cypher este viernes en el centro. Todos bienvenidos!',
      tipo: 'texto',
      likes: 30,
      comentarios: [],
    },
    {
      id: 'local-trap-4',
      autor: 'La Doble T',
      rol: 'Músico',
      tiempo: 'Hace 45 min · Cali',
      contenido: 'Beats disponibles para artistas. DM para info.',
      tipo: 'imagen',
      imagen: imgForo2,
      likes: 18,
      comentarios: [],
    },
    {
      id: 'local-trap-5',
      autor: 'Mike Flow',
      rol: 'Músico',
      tiempo: 'Hace 1 hora · Bogotá',
      contenido: 'Nuevo video ya en YouTube. Compartan!',
      tipo: 'texto',
      likes: 72,
      comentarios: [],
    },
    {
      id: 'local-trap-6',
      autor: 'Trap Colombia',
      rol: 'Oyente',
      tiempo: 'Hace 2 horas · Medellín',
      contenido: 'Quién es el mejor trapero colombiano del momento?',
      tipo: 'texto',
      likes: 100,
      comentarios: [],
    },
  ],
  '#metal': [
    {
      id: 'local-metal-1',
      autor: 'Kraken',
      rol: 'Músico',
      tiempo: 'Hace 5 min · Bogotá',
      contenido: 'El metal colombiano tiene historia. Recordemos las bandas clásicas!',
      tipo: 'imagen',
      imagen: imgForo1,
      likes: 45,
      comentarios: [],
    },
    {
      id: 'local-metal-2',
      autor: 'Dark Fest',
      rol: 'Músico',
      tiempo: 'Hace 20 min · Medellín',
      contenido: 'Festival de metal en Medellín próximo mes. Info en el link!',
      tipo: 'imagen',
      imagen: imgForo2,
      likes: 88,
      comentarios: [],
    },
    {
      id: 'local-metal-3',
      autor: 'Metal Head',
      rol: 'Oyente',
      tiempo: 'Hace 35 min · Bogotá',
      contenido: 'Busco bajista para banda de death metal. Serios interesados.',
      tipo: 'texto',
      likes: 15,
      comentarios: [],
    },
    {
      id: 'local-metal-4',
      autor: 'Zona Metal',
      rol: 'Oyente',
      tiempo: 'Hace 50 min · Cali',
      contenido: 'Top riffs de guitarra metal colombiana. Aporten!',
      tipo: 'texto',
      likes: 60,
      comentarios: [],
    },
    {
      id: 'local-metal-5',
      autor: 'Black Storm',
      rol: 'Músico',
      tiempo: 'Hace 1 hora · Bogotá',
      contenido: 'Nuevo álbum grabado completamente en análogo. Próximamente!',
      tipo: 'audio',
      audio: audioVampira,
      audioNombre: 'Black Storm - Preview',
      likes: 35,
      comentarios: [],
    },
    {
      id: 'local-metal-6',
      autor: 'Metal Club',
      rol: 'Músico',
      tiempo: 'Hace 2 horas · Medellín',
      contenido: 'Jam session de metal este sábado. Traigan sus instrumentos!',
      tipo: 'imagen',
      imagen: imgForo1,
      likes: 50,
      comentarios: [],
    },
  ],
  '#jazz': [
    {
      id: 'local-jazz-1',
      autor: 'Jazz Club Bogotá',
      rol: 'Músico',
      tiempo: 'Hace 10 min · Bogotá',
      contenido: 'Sesión de jazz en vivo este jueves. Entrada libre desde las 8pm!',
      tipo: 'imagen',
      imagen: imgForo2,
      likes: 30,
      comentarios: [],
    },
    {
      id: 'local-jazz-2',
      autor: 'Laura Pérez',
      rol: 'Oyente',
      tiempo: 'Hace 30 min · Medellín',
      contenido: 'El jazz colombiano merece más reconocimiento. Qué piensan?',
      tipo: 'texto',
      likes: 25,
      comentarios: [],
    },
    {
      id: 'local-jazz-3',
      autor: 'Trio Moderno',
      rol: 'Músico',
      tiempo: 'Hace 1 hora · Bogotá',
      contenido: 'Nuevo álbum de jazz fusión disponible en Spotify!',
      tipo: 'audio',
      audio: audioLolito,
      audioNombre: 'Jazz fusión - Preview',
      likes: 40,
      comentarios: [],
    },
  ],
  '#punk': [
    {
      id: 'local-punk-1',
      autor: 'Los Rebeldes',
      rol: 'Músico',
      tiempo: 'Hace 5 min · Bogotá',
      contenido: 'El punk no ha muerto. Toque este viernes en el Bunker!',
      tipo: 'imagen',
      imagen: imgForo1,
      likes: 35,
      comentarios: [],
    },
    {
      id: 'local-punk-2',
      autor: 'Punk Colombia',
      rol: 'Oyente',
      tiempo: 'Hace 20 min · Medellín',
      contenido: 'Recordando los inicios del punk en Colombia. Comparten sus historias?',
      tipo: 'texto',
      likes: 28,
      comentarios: [],
    },
  ],
  '#reggae': [
    {
      id: 'local-reggae-1',
      autor: 'Reggae Colombia',
      rol: 'Oyente',
      tiempo: 'Hace 8 min · Bogotá',
      contenido: 'El reggae colombiano tiene raíces profundas. Celebrémoslas!',
      tipo: 'texto',
      likes: 42,
      comentarios: [],
    },
    {
      id: 'local-reggae-2',
      autor: 'Irie Vibrations',
      rol: 'Músico',
      tiempo: 'Hace 25 min · Medellín',
      contenido: 'Nuevo EP de reggae roots disponible. Paz y amor!',
      tipo: 'audio',
      audio: audioLolito,
      audioNombre: 'Reggae roots - Preview',
      likes: 38,
      comentarios: [],
    },
  ],
  '#hiphop': [
    {
      id: 'local-hiphop-1',
      autor: 'Hip Hop Colombia',
      rol: 'Oyente',
      tiempo: 'Hace 4 min · Bogotá',
      contenido: 'El hip hop colombiano está en su mejor momento. Representando!',
      tipo: 'texto',
      likes: 75,
      comentarios: [],
    },
    {
      id: 'local-hiphop-2',
      autor: 'MC Bogotá',
      rol: 'Músico',
      tiempo: 'Hace 18 min · Bogotá',
      contenido: 'Freestyle session este miércoles en la Plaza de Bolívar!',
      tipo: 'imagen',
      imagen: imgForo2,
      likes: 90,
      comentarios: [],
    },
  ],
  '#folk': [
    {
      id: 'local-folk-1',
      autor: 'Folk Colombia',
      rol: 'Oyente',
      tiempo: 'Hace 12 min · Bogotá',
      contenido: 'La música folk colombiana es un tesoro cultural. Preservémosla!',
      tipo: 'texto',
      likes: 32,
      comentarios: [],
    },
    {
      id: 'local-folk-2',
      autor: 'Voz del Campo',
      rol: 'Músico',
      tiempo: 'Hace 28 min · Medellín',
      contenido: 'Nuevo álbum de folk andino disponible en todas las plataformas!',
      tipo: 'imagen',
      imagen: imgForo1,
      likes: 28,
      comentarios: [],
    },
  ],
  '#emo': [
    {
      id: 'local-emo-1',
      autor: 'Emo Colombia',
      rol: 'Oyente',
      tiempo: 'Hace 6 min · Bogotá',
      contenido: 'El emo nunca murió. Seguimos acá con las mismas heridas jaja!',
      tipo: 'texto',
      likes: 55,
      comentarios: [],
    },
    {
      id: 'local-emo-2',
      autor: 'Black Parade',
      rol: 'Músico',
      tiempo: 'Hace 22 min · Medellín',
      contenido: 'Noche emo este viernes. Trae tu eyeliner y tus feelz!',
      tipo: 'imagen',
      imagen: imgForo2,
      likes: 70,
      comentarios: [],
    },
  ],
};

const obtenerImagenUsuario = (usuario, index = 0) => {
  const usuarioNormalizado = usuario?.toLowerCase() || '';

  if (usuarioNormalizado.includes('sin valor') || usuarioNormalizado.includes('tú')) {
    return imgSinValor;
  }

  const imagenesUsuarios = [
    imgLuci,
    imgLuisJ,
    imgJose,
    imgMarianaG,
    imgElKraken,
    imgSofiaM,
  ];

  return imagenesUsuarios[index % imagenesUsuarios.length];
};

const normalizarRol = (rol, autor) => {
  const rolNormalizado = rol?.toLowerCase() || '';
  const autorNormalizado = autor?.toLowerCase() || '';

  if (autorNormalizado.includes('sin valor') || autorNormalizado.includes('tú')) return 'Músico';
  if (rolNormalizado.includes('músico') || rolNormalizado.includes('musico')) return 'Músico';
  if (rolNormalizado.includes('artista')) return 'Músico';
  if (rolNormalizado.includes('oyente')) return 'Oyente';
  if (rolNormalizado.includes('asistente')) return 'Oyente';

  return 'Oyente';
};

const obtenerImagenPost = (post, index = 0) => {
  if (post.imagen && typeof post.imagen !== 'string') return post.imagen;

  if (post.imagenUrl && post.imagenUrl.length > 0) {
    return { uri: post.imagenUrl };
  }

  if (post.tipo === 'imagen') {
    return index % 2 === 0 ? imgForo1 : imgForo2;
  }

  return null;
};

const obtenerAudioPost = (post) => {
  const texto = `${post.audioNombre || ''} ${post.contenido || ''}`.toLowerCase();

  if (post.audio && typeof post.audio !== 'string') return post.audio;

  if (post.audioUrl && post.audioUrl.length > 0) {
    return { uri: post.audioUrl };
  }

  if (texto.includes('lolito')) return audioLolito;
  if (texto.includes('vampira')) return audioVampira;

  return audioVampira;
};

const formatearTiempo = (createdAt, ciudad = 'Bogotá') => {
  if (!createdAt) return `Ahora · ${ciudad}`;

  const fecha = new Date(createdAt);

  if (Number.isNaN(fecha.getTime())) return `Reciente · ${ciudad}`;

  return `${fecha.toLocaleDateString()} · ${ciudad}`;
};

function AudioPlayer({ source, nombre }) {
  const soundRef = useRef(null);
  const barWidthRef = useRef(200);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let sound;

    const cargarAudio = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

        const { sound: nuevoSound } = await Audio.Sound.createAsync(
          source,
          { shouldPlay: false },
          (status) => {
            if (status.isLoaded) {
              if (status.durationMillis) setDuration(status.durationMillis);
              if (status.positionMillis != null) setPosition(status.positionMillis);

              if (status.didJustFinish) {
                setPlaying(false);
                setPosition(0);
              }
            }
          }
        );

        sound = nuevoSound;
        soundRef.current = nuevoSound;
      } catch (error) {
        console.log('Error cargando audio:', error);
      }
    };

    cargarAudio();

    return () => {
      sound?.unloadAsync();
    };
  }, [source]);

  const togglePlay = async () => {
    if (!soundRef.current) return;

    if (playing) {
      await soundRef.current.pauseAsync();
      setPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setPlaying(true);
    }
  };

  const handleBarPress = async (e) => {
    if (!soundRef.current || !duration) return;

    const x = e.nativeEvent?.locationX;
    const w = barWidthRef.current;

    if (x == null || !w) return;

    const ratio = Math.max(0, Math.min(x / w, 1));
    const nuevaPosicion = Math.round(ratio * duration);

    setPosition(nuevaPosicion);
    await soundRef.current.setPositionAsync(nuevaPosicion);
  };

  const formatTime = (ms) => {
    if (!ms || ms <= 0) return '0:00';

    const segundos = Math.floor(ms / 1000);
    const minutos = Math.floor(segundos / 60);

    return `${minutos}:${String(segundos % 60).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={audioStyles.container}>
      <View
        style={audioStyles.progressBg}
        onLayout={(e) => {
          barWidthRef.current = e.nativeEvent.layout.width;
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleBarPress}
        onResponderMove={handleBarPress}
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
          <Ionicons
            name={playing ? 'pause' : 'play'}
            size={18}
            color={Colors.background}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BadgeRol({ rol }) {
  const rolFinal = rol === 'Músico' ? 'Músico' : 'Oyente';

  return (
    <View style={rolFinal === 'Músico' ? styles.badgeMusico : styles.badgeOyente}>
      <Text style={styles.badgeText}>{rolFinal}</Text>
    </View>
  );
}

function AvatarUsuario({ autor, index = 0, grande = false }) {
  return (
    <Image
      source={obtenerImagenUsuario(autor, index)}
      style={grande ? styles.avatarGrande : styles.avatar}
      resizeMode="cover"
    />
  );
}

function PostCard({ p, index, onVerComentarios }) {
  const [liked, setLiked] = useState(false);
  const [faved, setFaved] = useState(false);
  const [likesCount, setLikesCount] = useState(p.likes || 0);

  const imagenPost = obtenerImagenPost(p, index);
  const audioPost = p.tipo === 'audio' ? obtenerAudioPost(p) : null;

  const toggleLike = () => {
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    setLiked(prev => !prev);
  };

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <AvatarUsuario autor={p.autor} index={index} />

        <View style={{ flex: 1 }}>
          <View style={styles.autorRow}>
            <Text style={styles.postAutor}>{p.autor}</Text>
            <BadgeRol rol={p.rol} />
          </View>

          <Text style={styles.postTiempo}>{p.tiempo}</Text>
        </View>
      </View>

      {!!p.contenido && (
        <Text style={styles.postContenido}>{p.contenido}</Text>
      )}

      {p.tipo === 'audio' && audioPost && (
        <AudioPlayer source={audioPost} nombre={p.audioNombre || 'Audio del foro'} />
      )}

      {p.tipo === 'imagen' && imagenPost && (
        <Image source={imagenPost} style={styles.postImagen} resizeMode="cover" />
      )}

      <View style={styles.postFooter}>
        <TouchableOpacity onPress={toggleLike} style={styles.footerAction}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={18}
            color={liked ? '#FF3B30' : Colors.textMuted}
          />
          <Text style={[styles.postLike, liked && styles.likeActivo]}>{likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onVerComentarios(p)} style={styles.footerAction}>
          <Ionicons name="chatbubble-outline" size={17} color={Colors.textMuted} />
          <Text style={styles.postComentario}>{p.comentarios?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFaved(!faved)} style={[styles.footerAction, { marginLeft: 'auto' }]}>
          <Ionicons
            name={faved ? 'star' : 'star-outline'}
            size={17}
            color={faved ? '#FFD600' : Colors.textMuted}
          />
          <Text style={[styles.postFav, faved && styles.favActivo]}>Fav</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ComentariosScreen({ post, foro, onBack, onComentarioCreado }) {
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState(post.comentarios || []);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [enviando, setEnviando] = useState(false);

  const imagenPost = obtenerImagenPost(post);
  const audioPost = post.tipo === 'audio' ? obtenerAudioPost(post) : null;

  const enviar = async () => {
    if (!comentario.trim() || enviando) return;

    const nuevoComentario = {
      autor: 'SIN VALOR',
      rol: 'Músico',
      texto: comentario.trim()
    };

    try {
      setEnviando(true);

      const respuesta = await fetch(`${API_URL}/foros/${post._id || post.id}/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoComentario)
      });

      const data = await respuesta.json();

      if (!respuesta.ok && !String(post.id || '').startsWith('local-')) {
        Alert.alert('Error', data.mensaje || 'No se pudo guardar el comentario.');
        return;
      }

      const comentarioLocal = {
        id: Date.now().toString(),
        ...nuevoComentario
      };

      setComentarios(prev => [...prev, comentarioLocal]);
      setComentario('');

      if (onComentarioCreado) {
        onComentarioCreado(post._id || post.id, comentarioLocal);
      }
    } catch (error) {
      if (String(post.id || '').startsWith('local-')) {
        const comentarioLocal = {
          id: Date.now().toString(),
          ...nuevoComentario
        };

        setComentarios(prev => [...prev, comentarioLocal]);
        setComentario('');

        if (onComentarioCreado) {
          onComentarioCreado(post._id || post.id, comentarioLocal);
        }

        return;
      }

      console.log('Error enviando comentario:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={onBack} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.foroTag}>{foro?.toUpperCase()}</Text>
        <Text style={styles.seccionLabel}>POST</Text>

        <View style={styles.postCardDetalle}>
          <View style={styles.postHeaderDetalle}>
            <AvatarUsuario autor={post.autor} grande />

            <View style={{ flex: 1 }}>
              <View style={styles.autorRow}>
                <Text style={styles.postAutor}>{post.autor}</Text>
                <BadgeRol rol={post.rol} />
              </View>

              <Text style={styles.postTiempo}>{post.tiempo}</Text>
            </View>
          </View>

          {!!post.contenido && (
            <Text style={styles.postContenido}>{post.contenido}</Text>
          )}

          {post.tipo === 'audio' && audioPost && (
            <AudioPlayer source={audioPost} nombre={post.audioNombre || 'Audio del foro'} />
          )}

          {post.tipo === 'imagen' && imagenPost && (
            <Image source={imagenPost} style={styles.postImagen} resizeMode="cover" />
          )}

          <View style={styles.postFooter}>
            <TouchableOpacity
              onPress={() => {
                setLikesCount(prev => liked ? prev - 1 : prev + 1);
                setLiked(prev => !prev);
              }}
              style={styles.footerAction}
            >
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={18}
                color={liked ? '#FF3B30' : Colors.textMuted}
              />
              <Text style={[styles.postLike, liked && styles.likeActivo]}>{likesCount}</Text>
            </TouchableOpacity>

            <View style={styles.footerAction}>
              <Ionicons name="chatbubble-outline" size={17} color={Colors.textMuted} />
              <Text style={styles.postComentario}>{comentarios.length}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.seccionLabel}>COMENTARIOS</Text>

        {comentarios.length === 0 && (
          <Text style={styles.sinComentarios}>Sé el primero en comentar.</Text>
        )}

        {comentarios.map((c, index) => {
          const autor = c.autor || c.usuario || 'Usuario';
          const rol = normalizarRol(c.rol || c.badge, autor);

          return (
            <View key={c.id || c._id || index} style={styles.comentarioCard}>
              <AvatarUsuario autor={autor} index={index} />

              <View style={{ flex: 1 }}>
                <View style={styles.comentarioHeader}>
                  <Text style={styles.comentarioAutor}>{autor}</Text>
                  <BadgeRol rol={rol} />
                </View>

                <Text style={styles.comentarioTexto}>{c.texto}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un comentario..."
          placeholderTextColor={Colors.textMuted}
          value={comentario}
          onChangeText={setComentario}
          onSubmitEditing={enviar}
          returnKeyType="send"
        />

        <TouchableOpacity
          style={[styles.enviarBtn, enviando && styles.enviarBtnDesactivado]}
          onPress={enviar}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator color={Colors.background} size="small" />
          ) : (
            <Ionicons name="arrow-up" size={18} color={Colors.background} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function NuevoPostModal({ visible, foro, onClose, onPublicar }) {
  const [texto, setTexto] = useState('');
  const [imagen, setImagen] = useState(null);
  const [audio, setAudio] = useState(null);
  const [publicando, setPublicando] = useState(false);

  const reset = () => {
    setTexto('');
    setImagen(null);
    setAudio(null);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8
    });

    if (!result.canceled && result.assets?.[0]) {
      setImagen({ uri: result.assets[0].uri });
      setAudio(null);
    }
  };

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets?.[0]) {
        setAudio({
          uri: result.assets[0].uri,
          nombre: result.assets[0].name
        });
        setImagen(null);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el audio.');
    }
  };

  const publicar = async () => {
    if (!texto.trim() && !imagen && !audio) {
      Alert.alert('Vacío', 'Escribe algo o adjunta un archivo.');
      return;
    }

    const tipo = imagen ? 'imagen' : audio ? 'audio' : 'texto';

    const nuevoPost = {
      foro,
      autor: 'SIN VALOR',
      ciudad: 'Bogotá',
      contenido: texto.trim(),
      tipo,
      imagenUrl: imagen?.uri || '',
      audioUrl: audio?.uri || '',
      audioNombre: audio?.nombre || '',
      likes: 0,
      comentarios: [],
      estado: 'Activo'
    };

    try {
      setPublicando(true);
      await onPublicar(nuevoPost);
      reset();
      onClose();
    } finally {
      setPublicando(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          <View style={modalStyles.sheetHeader}>
            <TouchableOpacity
              onPress={() => {
                reset();
                onClose();
              }}
              disabled={publicando}
            >
              <Text style={modalStyles.cancelBtn}>Cancelar</Text>
            </TouchableOpacity>

            <Text style={modalStyles.sheetTitle}>Nuevo post en {foro}</Text>

            <TouchableOpacity
              onPress={publicar}
              style={[modalStyles.pubBtn, publicando && modalStyles.pubBtnDisabled]}
              disabled={publicando}
            >
              <Text style={modalStyles.pubBtnText}>
                {publicando ? 'Publicando...' : 'Publicar'}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={modalStyles.textInput}
            placeholder="¿Qué quieres compartir?"
            placeholderTextColor={Colors.textMuted}
            value={texto}
            onChangeText={setTexto}
            multiline
            maxLength={500}
          />

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

export default function ForosScreen({ route }) {
  const [foroActivo, setForoActivo] = useState(route?.params?.foroInicial || null);
  const [postActivo, setPostActivo] = useState(null);
  const [mostrarNuevoPost, setMostrarNuevoPost] = useState(false);
  const [postsPorForoLocal, setPostsPorForoLocal] = useState(postsPorForo);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPosts();
  }, []);

  const prepararPostsLocales = () => {
    const postsAntiguosFormateados = {};

    Object.keys(postsPorForo).forEach((foro) => {
      postsAntiguosFormateados[foro] = postsPorForo[foro].map((p, index) => ({
        ...p,
        _id: p.id,
        foro,
        rol: normalizarRol(p.rol, p.autor),
        imagen: p.imagen || obtenerImagenPost(p, index),
        audio: p.audio || (p.tipo === 'audio' ? obtenerAudioPost(p) : null),
      }));
    });

    return postsAntiguosFormateados;
  };

  const cargarPosts = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch(`${API_URL}/foros`);
      const data = await respuesta.json();

      const postsBackend = (data.data || []).map((p, index) => {
        const autor = p.autor || 'Usuario';
        const rol = normalizarRol(p.rol || p.badge, autor);

        return {
          id: p._id,
          _id: p._id,
          foro: p.foro,
          autor,
          rol,
          tiempo: formatearTiempo(p.createdAt, p.ciudad || 'Bogotá'),
          ciudad: p.ciudad || 'Bogotá',
          contenido: p.contenido || '',
          tipo: p.tipo || 'texto',
          imagenUrl: p.imagenUrl || '',
          audioUrl: p.audioUrl || '',
          audioNombre: p.audioNombre || '',
          likes: p.likes || 0,
          comentarios: (p.comentarios || []).map((c, comentarioIndex) => {
            const autorComentario = c.autor || c.usuario || 'Usuario';
            const rolComentario = normalizarRol(c.rol || c.badge, autorComentario);

            return {
              id: c._id || `${p._id}-c-${comentarioIndex}`,
              _id: c._id,
              autor: autorComentario,
              rol: rolComentario,
              texto: c.texto
            };
          }),
          estado: p.estado || 'Activo',
          imagen: obtenerImagenPost(p, index),
          audio: p.tipo === 'audio' ? obtenerAudioPost(p) : null,
        };
      });

      const agrupadosBackend = {};

      postsBackend.forEach((post) => {
        if (!agrupadosBackend[post.foro]) {
          agrupadosBackend[post.foro] = [];
        }

        agrupadosBackend[post.foro].push(post);
      });

      const postsLocales = prepararPostsLocales();
      const mezclaFinal = { ...postsLocales };

      Object.keys(agrupadosBackend).forEach((foro) => {
        mezclaFinal[foro] = [
          ...agrupadosBackend[foro],
          ...(postsLocales[foro] || [])
        ];
      });

      setPostsPorForoLocal(mezclaFinal);
    } catch (error) {
      console.log('Error cargando foros:', error);
      setPostsPorForoLocal(prepararPostsLocales());
    } finally {
      setCargando(false);
    }
  };

  const agregarPost = async (nuevoPost) => {
    try {
      const respuesta = await fetch(`${API_URL}/foros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoPost)
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        Alert.alert('Error', data.mensaje || 'No se pudo publicar el post.');
        return;
      }

      const postCreadoBackend = data.data || data;

      const postLocal = {
        id: postCreadoBackend._id || Date.now().toString(),
        _id: postCreadoBackend._id || Date.now().toString(),
        foro: nuevoPost.foro,
        autor: 'SIN VALOR',
        rol: 'Músico',
        tiempo: 'Ahora · Bogotá',
        ciudad: 'Bogotá',
        contenido: nuevoPost.contenido,
        tipo: nuevoPost.tipo,
        imagenUrl: nuevoPost.imagenUrl,
        audioUrl: nuevoPost.audioUrl,
        audioNombre: nuevoPost.audioNombre,
        likes: 0,
        comentarios: [],
        estado: 'Activo',
        imagen: nuevoPost.tipo === 'imagen' && nuevoPost.imagenUrl
          ? { uri: nuevoPost.imagenUrl }
          : null,
        audio: nuevoPost.tipo === 'audio' && nuevoPost.audioUrl
          ? { uri: nuevoPost.audioUrl }
          : null
      };

      setPostsPorForoLocal(prev => ({
        ...prev,
        [nuevoPost.foro]: [postLocal, ...(prev[nuevoPost.foro] || [])]
      }));
    } catch (error) {
      console.log('Error publicando foro:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };

  const actualizarComentarioLocal = (postId, nuevoComentario) => {
    setPostsPorForoLocal(prev => {
      const copia = { ...prev };

      Object.keys(copia).forEach((foro) => {
        copia[foro] = copia[foro].map((post) => {
          if ((post._id || post.id) === postId) {
            return {
              ...post,
              comentarios: [...(post.comentarios || []), nuevoComentario]
            };
          }

          return post;
        });
      });

      return copia;
    });

    setPostActivo(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        comentarios: [...(prev.comentarios || []), nuevoComentario]
      };
    });
  };

  if (postActivo) {
    return (
      <ComentariosScreen
        post={postActivo}
        foro={foroActivo}
        onBack={() => setPostActivo(null)}
        onComentarioCreado={actualizarComentarioLocal}
      />
    );
  }

  if (foroActivo) {
    const posts = postsPorForoLocal[foroActivo] || [];

    return (
      <SafeAreaView style={styles.container}>
        <Header onBack={() => setForoActivo(null)} />

        <NuevoPostModal
          visible={mostrarNuevoPost}
          foro={foroActivo}
          onClose={() => setMostrarNuevoPost(false)}
          onPublicar={agregarPost}
        />

        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.titulo}>{foroActivo.toUpperCase()}</Text>

          {cargando && (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={Colors.primary} />
              <Text style={styles.loadingText}>Cargando publicaciones...</Text>
            </View>
          )}

          {!cargando && posts.length === 0 && (
            <Text style={styles.sinPosts}>No hay posts en este foro todavía. Sé el primero.</Text>
          )}

          {!cargando && posts.map((p, index) => (
            <PostCard
              key={p.id || p._id}
              p={p}
              index={index}
              onVerComentarios={(post) => setPostActivo(post)}
            />
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.inputRow}
          activeOpacity={0.8}
          onPress={() => setMostrarNuevoPost(true)}
        >
          <View style={[styles.input, { justifyContent: 'center' }]} pointerEvents="none">
            <Text style={{ color: Colors.textMuted, fontSize: 14 }}>¿Qué quieres compartir?</Text>
          </View>

          <View style={styles.enviarBtn}>
            <Ionicons name="add" size={20} color={Colors.background} />
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

        <Text style={styles.subtitulo}>Tus foros</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {foros.map(f => (
            <TouchableOpacity
              key={f.id}
              style={styles.foroCard}
              onPress={() => setForoActivo(f.nombre)}
            >
              <Image source={f.imagen} style={styles.foroImg} />
              <Text style={styles.foroNombre}>{f.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.subtitulo}>Los foros más populares</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {foros.map(f => (
            <TouchableOpacity
              key={`pop-${f.id}`}
              style={styles.foroCard}
              onPress={() => setForoActivo(f.nombre)}
            >
              <Image source={f.imagen} style={styles.foroImg} />
              <Text style={styles.foroNombre}>{f.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.subtitulo}>Foros olvidados</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {forosOlvidados.map(f => (
            <TouchableOpacity
              key={f.id}
              style={styles.foroCard}
              onPress={() => setForoActivo(f.nombre)}
            >
              <Image source={f.imagen} style={styles.foroImg} />
              <Text style={styles.foroNombre}>{f.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const audioStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 4,
  },
  progressBg: {
    height: 18,
    justifyContent: 'center',
    marginBottom: 4,
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  times: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  nombre: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cancelBtn: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  sheetTitle: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  pubBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  pubBtnDisabled: {
    backgroundColor: Colors.border,
  },
  pubBtnText: {
    color: Colors.background,
    fontWeight: '800',
    fontSize: 13,
  },
  textInput: {
    color: Colors.text,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  previewRow: {
    position: 'relative',
    marginBottom: 12,
  },
  previewImg: {
    width: '100%',
    height: 160,
    borderRadius: 10,
  },
  audioPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  audioPreviewNombre: {
    flex: 1,
    color: Colors.text,
    fontSize: 13,
  },
  removeBtn: {
    padding: 4,
  },
  removeX: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  adjuntarRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  adjuntarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  adjuntarLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: 16,
  },
  titulo: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 16,
  },
  subtitulo: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  foroTag: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  seccionLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 10,
    marginTop: 8,
  },
  foroCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  foroImg: {
    width: 140,
    height: 100,
    borderRadius: 10,
    marginBottom: 6,
  },
  foroNombre: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  loadingBox: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  sinPosts: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
  sinComentarios: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 14,
  },
  postCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  postCardDetalle: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  postHeaderDetalle: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.border,
  },
  avatarGrande: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.border,
  },
  autorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  postAutor: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  postTiempo: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  postContenido: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
  },
  postImagen: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 10,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  postLike: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  likeActivo: {
    color: '#FF3B30',
  },
  postComentario: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  postFav: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  favActivo: {
    color: '#FFD600',
    fontWeight: '900',
  },
  comentarioCard: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 10,
  },
  comentarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  comentarioAutor: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  comentarioTexto: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  badgeMusico: {
    backgroundColor: '#F9B233',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeOyente: {
    backgroundColor: '#4A8AF0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    color: Colors.text,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  enviarBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enviarBtnDesactivado: {
    backgroundColor: Colors.border,
  },
});