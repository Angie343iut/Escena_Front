import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Image, TextInput, Modal,
  ActivityIndicator, Alert
} from 'react-native';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import ReproductorScreen from './ReproductorScreen';
import SubirMusicaScreen from './SubirMusicaScreen';
import EstadisticasScreen from './EstadisticasScreen';
import { API_URL } from '../api/api';

const fotoSinValor = require('../assets/foto_artista.png');
const imgPlaylist = require('../assets/playlist.jpg');
const imgCarroña = require('../assets/carroña.jpg');

const audioAvanza = require('../assets/sinvalor_avanza.mp3');
const audioConsumido = require('../assets/sinvalor_consumido.mp3');
const audioSinValor = require('../assets/sinvalor_sinvalor.mp3');
const audioUnDiaTriste = require('../assets/undia_triste_rlnzu.mp3');
const audioVampira = require('../assets/vampira_911.mp3');
const audioCuchas = require('../assets/cuchas_sobrepensando.mp3');
const audioLolito = require('../assets/lolitossinclair.mp3');
const audioDiamante = require('../assets/diamante_kamikaze.mp3');

const audios = [
  audioAvanza,
  audioConsumido,
  audioSinValor,
  audioUnDiaTriste,
  audioVampira,
  audioCuchas,
  audioLolito,
  audioDiamante,
];

const audioAleatorio = () => audios[Math.floor(Math.random() * audios.length)];

const misCancionesBase = [
  { id: '1', titulo: 'Marchito', artista: 'SIN VALOR', imagen: imgPlaylist, audio: audioAleatorio() },
  { id: '2', titulo: 'La Estructura', artista: 'SIN VALOR', imagen: imgPlaylist, audio: audioAleatorio() },
  { id: '3', titulo: 'Carroña', artista: 'SIN VALOR', imagen: imgCarroña, audio: audioAleatorio() },
  { id: '4', titulo: 'Mala Conducta', artista: 'SIN VALOR', imagen: imgPlaylist, audio: audioAleatorio() },
  { id: '5', titulo: '(intro)', artista: 'SIN VALOR', imagen: imgPlaylist, audio: audioAleatorio() },
  { id: '6', titulo: 'N.N.', artista: 'SIN VALOR', imagen: imgPlaylist, audio: audioAleatorio() },
];

const muroBase = [
  { id: '1', texto: 'Andamos trabajando en el primer single, Quien quiere escucharlo???', likes: 80, comentarios: 10, tiempo: 'Hace 1 dia' },
  { id: '2', texto: 'Proximo toque en CLUB CLANDESTINO chicos', likes: 80, comentarios: 10, tiempo: 'Hace 1 dia' },
  { id: '3', texto: 'Gracias por todo el apoyo en el ultimo show, fue increible!', likes: 120, comentarios: 15, tiempo: 'Hace 2 dias' },
  { id: '4', texto: 'Nueva cancion disponible en todas las plataformas. Escuchenla!', likes: 95, comentarios: 8, tiempo: 'Hace 3 dias' },
  { id: '5', texto: 'Ensayando para el proximo toque, viene con todo!', likes: 60, comentarios: 5, tiempo: 'Hace 4 dias' },
  { id: '6', texto: 'Muchas gracias a todos los que nos han apoyado desde el principio!', likes: 200, comentarios: 25, tiempo: 'Hace 5 dias' },
];

const obtenerImagenCancion = (titulo) => {
  const tituloNormalizado = titulo?.toLowerCase() || '';

  if (tituloNormalizado.includes('carroña') || tituloNormalizado.includes('carrona')) {
    return imgCarroña;
  }

  return imgPlaylist;
};

const obtenerAudioCancion = (titulo) => {
  const tituloNormalizado = titulo?.toLowerCase() || '';

  if (tituloNormalizado.includes('avanza')) return audioAvanza;
  if (tituloNormalizado.includes('consumido')) return audioConsumido;
  if (tituloNormalizado === 'sin valor') return audioSinValor;
  if (tituloNormalizado.includes('un día triste') || tituloNormalizado.includes('un dia triste')) return audioUnDiaTriste;
  if (tituloNormalizado.includes('vampira')) return audioVampira;
  if (tituloNormalizado.includes('sobrepensando')) return audioCuchas;
  if (tituloNormalizado.includes('lolito')) return audioLolito;
  if (tituloNormalizado.includes('kamikaze')) return audioDiamante;

  return audioAleatorio();
};

const formatearTiempo = (createdAt) => {
  if (!createdAt) return 'Ahora';

  const fecha = new Date(createdAt);

  if (Number.isNaN(fecha.getTime())) return 'Reciente';

  return fecha.toLocaleDateString();
};

export default function PerfilUsuarioScreen({ onClose, onCerrarSesion }) {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState('SIN VALOR');
  const [bio, setBio] = useState(
    'Somos SIN VALOR\nLos esperamos el 2 de mayo en Acto Latino.\nLA ESTRUCTURA disponible en streaming.'
  );
  const [nombreTemp, setNombreTemp] = useState(nombre);
  const [bioTemp, setBioTemp] = useState(bio);
  const [cancionActiva, setCancionActiva] = useState(null);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [subirVisible, setSubirVisible] = useState(false);
  const [estadisticasVisible, setEstadisticasVisible] = useState(false);
  const [misCanciones, setMisCanciones] = useState(misCancionesBase);
  const [muro, setMuro] = useState(muroBase);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);

  useEffect(() => {
    setCancionActiva(null);
    setSubirVisible(false);
    setEstadisticasVisible(false);
    cargarDatosPerfil();
  }, []);

  const cargarDatosPerfil = async () => {
    try {
      setCargandoPerfil(true);

      const [respuestaCanciones, respuestaForos] = await Promise.all([
        fetch(`${API_URL}/canciones`),
        fetch(`${API_URL}/foros`)
      ]);

      const dataCanciones = await respuestaCanciones.json();
      const dataForos = await respuestaForos.json();

      const cancionesBackend = (dataCanciones.data || [])
        .filter((cancion) => {
          const artista = cancion.artista?.toLowerCase() || '';
          return artista.includes('sin valor');
        })
        .map((cancion, index) => ({
          id: cancion._id || `backend-cancion-${index}`,
          _id: cancion._id,
          titulo: cancion.titulo || 'Canción sin título',
          artista: cancion.artista || 'SIN VALOR',
          genero: cancion.genero || '',
          album: cancion.album || '',
          imagen: obtenerImagenCancion(cancion.titulo),
          audio: obtenerAudioCancion(cancion.titulo)
        }));

      if (cancionesBackend.length > 0) {
        const idsBackend = new Set(cancionesBackend.map(c => c.titulo.toLowerCase()));

        const cancionesLocalesFaltantes = misCancionesBase.filter(
          c => !idsBackend.has(c.titulo.toLowerCase())
        );

        setMisCanciones([...cancionesBackend, ...cancionesLocalesFaltantes]);
      } else {
        setMisCanciones(misCancionesBase);
      }

      const postsBackend = (dataForos.data || [])
        .filter((post) => {
          const autor = post.autor?.toLowerCase() || '';
          return autor.includes('sin valor');
        })
        .map((post, index) => ({
          id: post._id || `backend-post-${index}`,
          texto: post.contenido || '',
          likes: post.likes || 0,
          comentarios: post.comentarios?.length || 0,
          tiempo: formatearTiempo(post.createdAt),
          tipo: post.tipo || 'texto',
          imagenUrl: post.imagenUrl || '',
          audioUrl: post.audioUrl || '',
          foro: post.foro || ''
        }));

      if (postsBackend.length > 0) {
        setMuro([...postsBackend, ...muroBase]);
      } else {
        setMuro(muroBase);
      }
    } catch (error) {
      console.log('Error cargando perfil:', error);
      setMisCanciones(misCancionesBase);
      setMuro(muroBase);
    } finally {
      setCargandoPerfil(false);
    }
  };

  const guardar = () => {
    setNombre(nombreTemp);
    setBio(bioTemp);
    setEditando(false);
  };

  const cancelar = () => {
    setNombreTemp(nombre);
    setBioTemp(bio);
    setEditando(false);
  };

  const cerrarSubirMusica = () => {
    setSubirVisible(false);
    cargarDatosPerfil();
  };

  if (editando) {
    return (
      <SafeAreaView style={styles.container}>
        <Header onBack={cancelar} />

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.editFotoWrapper}>
            <Image source={fotoSinValor} style={styles.editFoto} />

            <View style={styles.editFotoOverlay}>
              <Ionicons name="pencil" size={36} color={Colors.text} />
            </View>
          </View>

          <View style={styles.editNombreRow}>
            <TextInput
              style={styles.editNombreInput}
              value={nombreTemp}
              onChangeText={setNombreTemp}
              placeholderTextColor={Colors.textMuted}
            />

            <Ionicons name="pencil-outline" size={16} color={Colors.textMuted} />
          </View>

          <View style={styles.editBioWrapper}>
            <TextInput
              style={styles.editBioInput}
              value={bioTemp}
              onChangeText={setBioTemp}
              multiline
              numberOfLines={4}
              placeholderTextColor={Colors.textMuted}
            />

            <Ionicons
              name="pencil-outline"
              size={16}
              color={Colors.textMuted}
              style={styles.editBioIcon}
            />
          </View>

          <TouchableOpacity style={styles.guardarBtn} onPress={guardar}>
            <Text style={styles.guardarBtnText}>Guardar</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (cancionActiva) {
    return (
      <ReproductorScreen
        cancion={cancionActiva}
        canciones={misCanciones}
        indice={indiceActivo}
        onClose={() => setCancionActiva(null)}
      />
    );
  }

  const columnasCanciones = [];
  for (let i = 0; i < misCanciones.length; i += 2) {
    columnasCanciones.push(misCanciones.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={onClose} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topSection}>
          <Image source={fotoSinValor} style={styles.fotoPerfil} />

          <Text style={styles.nombre}>{nombre}</Text>

          <View style={styles.badgesRow}>
            <View style={styles.badgeMusico}>
              <Text style={styles.badgeText}>Músico</Text>
            </View>

            <View style={styles.badgeColaborador}>
              <Text style={styles.badgeText}>Colaborador</Text>
            </View>
          </View>

          <Text style={styles.bio}>{bio}</Text>

          <View style={styles.botonesRow}>
            <TouchableOpacity style={styles.btnEditar} onPress={() => setEditando(true)}>
              <Text style={styles.btnEditarText}>+ Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCompartir}>
              <Text style={styles.btnCompartirText}>Compartir perfil</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btnCerrarSesion} onPress={onCerrarSesion || onClose}>
            <Text style={styles.btnCerrarSesionText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.publicarCard} onPress={() => setSubirVisible(true)}>
          <Text style={styles.publicarTexto}>
            Subir un post o publicar{'\n'}un track
          </Text>

          <View style={styles.publicarBtn}>
            <Text style={styles.publicarBtnText}>+</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.estadisticasBtn} onPress={() => setEstadisticasVisible(true)}>
          <Text style={styles.estadisticasBtnText}>Analiza tus estadísticas</Text>
        </TouchableOpacity>

        {cargandoPerfil && (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.loadingText}>Cargando perfil...</Text>
          </View>
        )}

        <Text style={styles.seccion}>Mi música</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={styles.gridCanciones}>
            {columnasCanciones.map((col, i) => (
              <View key={i} style={styles.columna}>
                {col.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.cancionCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      const idx = misCanciones.findIndex(x => x.id === c.id);
                      setIndiceActivo(idx);
                      setCancionActiva(c);
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
            Músico Activo <Text style={styles.verificacionSub}>{misCanciones.length} releases publicados</Text>
          </Text>

          <View style={styles.activoBadge}>
            <Text style={styles.activoText}>Activo</Text>
          </View>
        </View>

        <Text style={styles.seccion}>Mi Muro</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {muro.map(p => (
            <View key={p.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <Image source={fotoSinValor} style={styles.postAvatar} />

                <View>
                  <Text style={styles.postAutor}>{nombre}</Text>
                  <Text style={styles.postTiempo}>{p.tiempo}</Text>
                </View>
              </View>

              {p.tipo === 'imagen' && p.imagenUrl ? (
                <Image source={{ uri: p.imagenUrl }} style={styles.postMuroImagen} />
              ) : null}

              <Text style={styles.postTexto} numberOfLines={5}>{p.texto}</Text>

              <View style={styles.postFooter}>
                <Text style={styles.postLike}>❤ {p.likes}</Text>
                <Text style={styles.postComentario}>💬 {p.comentarios}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      <Modal visible={subirVisible} animationType="slide">
        <SubirMusicaScreen onClose={cerrarSubirMusica} />
      </Modal>

      <Modal visible={estadisticasVisible} animationType="slide">
        <EstadisticasScreen onClose={() => setEstadisticasVisible(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },

  loadingBox: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13
  },

  editFotoWrapper: { alignSelf: 'center', marginBottom: 24, marginTop: 8 },
  editFoto: { width: 140, height: 140, borderRadius: 70 },
  editFotoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 70,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  editNombreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20
  },
  editNombreInput: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 4,
    minWidth: 150
  },
  editBioWrapper: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border
  },
  editBioInput: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 20,
    minHeight: 80,
    textAlignVertical: 'top'
  },
  editBioIcon: { alignSelf: 'flex-end', marginTop: 8 },
  guardarBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24
  },
  guardarBtnText: {
    color: Colors.background,
    fontWeight: '800',
    fontSize: 16
  },

  topSection: {
    alignItems: 'center',
    marginBottom: 16,
    width: '100%'
  },
  fotoPerfil: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 16
  },
  nombre: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12
  },
  badgeMusico: {
    backgroundColor: '#F9B233',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  badgeColaborador: {
    backgroundColor: '#A47EDE',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  badgeText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 12
  },
  bio: {
    color: Colors.textMuted,
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 20
  },
  botonesRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 10
  },
  btnEditar: {
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10
  },
  btnEditarText: {
    color: Colors.text,
    fontWeight: '600'
  },
  btnCompartir: {
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10
  },
  btnCompartirText: {
    color: Colors.text,
    fontWeight: '600'
  },
  btnCerrarSesion: {
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 8
  },
  btnCerrarSesionText: {
    color: '#FF3B30',
    fontWeight: '600'
  },

  publicarCard: {
    backgroundColor: '#2A3A1A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4A6A2A'
  },
  publicarTexto: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 20
  },
  publicarBtn: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  publicarBtnText: {
    color: Colors.background,
    fontSize: 22,
    fontWeight: '900',
    marginTop: -2
  },
  estadisticasBtn: {
    backgroundColor: '#2A3A1A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4A6A2A'
  },
  estadisticasBtnText: {
    color: Colors.text,
    fontWeight: '800',
    fontSize: 15
  },

  seccion: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
    marginTop: 8
  },
  gridCanciones: {
    flexDirection: 'row',
    gap: 8
  },
  columna: {
    flexDirection: 'column',
    gap: 8
  },
  cancionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 10,
    gap: 8,
    width: 180
  },
  cancionImg: {
    width: 40,
    height: 40,
    borderRadius: 6
  },
  cancionTitulo: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 12
  },
  cancionArtista: {
    color: Colors.textMuted,
    fontSize: 10
  },
  puntos: {
    color: Colors.textMuted,
    fontSize: 16
  },

  verificacionCard: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  verificacionTitulo: {
    color: Colors.text,
    fontWeight: '700'
  },
  verificacionSub: {
    color: Colors.textMuted,
    fontWeight: '400',
    fontSize: 12
  },
  activoBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  activoText: {
    color: Colors.background,
    fontWeight: '700',
    fontSize: 12
  },

  postCard: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 12,
    width: 160,
    marginRight: 12,
    minHeight: 210
  },
  postHeader: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  postAutor: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 12
  },
  postTiempo: {
    color: Colors.textMuted,
    fontSize: 10
  },
  postMuroImagen: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8
  },
  postTexto: {
    color: Colors.text,
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 17
  },
  postFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto'
  },
  postLike: {
    color: Colors.textMuted,
    fontSize: 12
  },
  postComentario: {
    color: Colors.textMuted,
    fontSize: 12
  },
});