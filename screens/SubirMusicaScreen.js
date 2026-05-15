import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Colors } from '../constants/colors';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { API_URL } from '../api/api';

const fotoSinValor = require('../assets/foto_artista.png');

export default function SubirMusicaScreen({ onClose }) {
  const [titulo, setTitulo] = useState('');
  const [genero, setGenero] = useState('');
  const [album, setAlbum] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [audio, setAudio] = useState(null);
  const [publicando, setPublicando] = useState(false);
  const [tipoPublicacion, setTipoPublicacion] = useState('track');

  const limpiarFormulario = () => {
    setTitulo('');
    setGenero('');
    setAlbum('');
    setDescripcion('');
    setImagen(null);
    setAudio(null);
    setTipoPublicacion('track');
  };

  const descartar = () => {
    limpiarFormulario();
    onClose();
  };

  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para seleccionar una imagen.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8
    });

    if (!resultado.canceled && resultado.assets?.[0]) {
      setImagen({
        uri: resultado.assets[0].uri,
        nombre: resultado.assets[0].fileName || 'portada.jpg'
      });
    }
  };

  const seleccionarAudio = async () => {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true
      });

      if (!resultado.canceled && resultado.assets?.[0]) {
        setAudio({
          uri: resultado.assets[0].uri,
          nombre: resultado.assets[0].name || 'audio.mp3'
        });
      }
    } catch (error) {
      console.log('Error seleccionando audio:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo de audio.');
    }
  };

  const publicarCancion = async () => {
    if (!titulo.trim()) {
      Alert.alert('Campo requerido', 'Escribe el título de la canción.');
      return false;
    }

    if (!genero.trim()) {
      Alert.alert('Campo requerido', 'Escribe el género de la canción.');
      return false;
    }

    const nuevaCancion = {
      titulo: titulo.trim(),
      artista: 'SIN VALOR',
      genero: genero.trim(),
      album: album.trim(),
      descripcion: descripcion.trim(),
      imagenUrl: imagen?.uri || '',
      audioUrl: audio?.uri || '',
      estado: 'Activa'
    };

    const respuesta = await fetch(`${API_URL}/canciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaCancion)
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      Alert.alert('Error', data.mensaje || 'No se pudo guardar la canción.');
      return false;
    }

    return true;
  };

  const publicarPost = async () => {
    if (!descripcion.trim() && !imagen && !audio && !titulo.trim()) {
      Alert.alert('Publicación vacía', 'Escribe una descripción, título o adjunta un archivo.');
      return false;
    }

    const tipo = audio ? 'audio' : imagen ? 'imagen' : 'texto';

    const nuevoPost = {
      foro: genero.trim() ? `#${genero.trim().toLowerCase()}` : '#indie',
      autor: 'SIN VALOR',
      rol: 'Músico',
      ciudad: 'Bogotá',
      contenido: descripcion.trim() || titulo.trim(),
      tipo,
      imagenUrl: imagen?.uri || '',
      audioUrl: audio?.uri || '',
      audioNombre: audio?.nombre || titulo.trim(),
      likes: 0,
      comentarios: [],
      estado: 'Activo'
    };

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
      return false;
    }

    return true;
  };

  const publicar = async () => {
    if (publicando) return;

    try {
      setPublicando(true);

      let ok = false;

      if (tipoPublicacion === 'track') {
        ok = await publicarCancion();

        if (ok && descripcion.trim()) {
          await publicarPost();
        }
      } else {
        ok = await publicarPost();
      }

      if (ok) {
        Alert.alert(
          'Publicado',
          tipoPublicacion === 'track'
            ? 'Tu canción fue publicada correctamente.'
            : 'Tu post fue publicado correctamente.'
        );

        limpiarFormulario();
        onClose();
      }
    } catch (error) {
      console.log('Error publicando:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setPublicando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={onClose} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>SUBIR MÚSICA</Text>

        <View style={styles.tipoRow}>
          <TouchableOpacity
            style={[
              styles.tipoBtn,
              tipoPublicacion === 'track' && styles.tipoBtnActivo
            ]}
            onPress={() => setTipoPublicacion('track')}
          >
            <Text
              style={[
                styles.tipoText,
                tipoPublicacion === 'track' && styles.tipoTextActivo
              ]}
            >
              Track
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tipoBtn,
              tipoPublicacion === 'post' && styles.tipoBtnActivo
            ]}
            onPress={() => setTipoPublicacion('post')}
          >
            <Text
              style={[
                styles.tipoText,
                tipoPublicacion === 'post' && styles.tipoTextActivo
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.archivoRow}>
          <TouchableOpacity style={styles.archivoBox} onPress={seleccionarImagen}>
            {imagen ? (
              <Image source={{ uri: imagen.uri }} style={styles.previewImagen} />
            ) : (
              <Ionicons name="camera-outline" size={48} color={Colors.primary} />
            )}
          </TouchableOpacity>

          <View style={styles.archivoInfo}>
            <Text style={styles.archivoNombre} numberOfLines={2}>
              {audio?.nombre || imagen?.nombre || 'Nombre del archivo'}
            </Text>

            <TouchableOpacity style={styles.sustituirBtn} onPress={seleccionarAudio}>
              <Text style={styles.sustituirText}>
                {audio ? 'Cambiar audio' : 'Seleccionar audio'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.imagenBtn} onPress={seleccionarImagen}>
              <Text style={styles.imagenBtnText}>
                {imagen ? 'Cambiar portada' : 'Seleccionar portada'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe el título..."
          placeholderTextColor={Colors.textMuted}
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Género</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: indie, rock, trap..."
          placeholderTextColor={Colors.textMuted}
          value={genero}
          onChangeText={setGenero}
        />

        {tipoPublicacion === 'track' && (
          <>
            <Text style={styles.label}>Álbum (Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Escribe el álbum..."
              placeholderTextColor={Colors.textMuted}
              value={album}
              onChangeText={setAlbum}
            />
          </>
        )}

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder={
            tipoPublicacion === 'track'
              ? 'Cuéntale a tus oyentes sobre este lanzamiento...'
              : '¿Qué quieres compartir?'
          }
          placeholderTextColor={Colors.textMuted}
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <Image source={fotoSinValor} style={styles.previewAvatar} />

            <View>
              <Text style={styles.previewAutor}>SIN VALOR</Text>
              <View style={styles.badgeMusico}>
                <Text style={styles.badgeText}>Músico</Text>
              </View>
            </View>
          </View>

          <Text style={styles.previewTitulo}>
            {titulo.trim() || 'Título de tu publicación'}
          </Text>

          {!!descripcion.trim() && (
            <Text style={styles.previewDescripcion}>{descripcion}</Text>
          )}

          {imagen && (
            <Image source={{ uri: imagen.uri }} style={styles.previewPostImagen} />
          )}

          {audio && (
            <View style={styles.audioPreview}>
              <Ionicons name="musical-note" size={18} color={Colors.primary} />
              <Text style={styles.audioPreviewText} numberOfLines={1}>
                {audio.nombre}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.botonesRow}>
          <TouchableOpacity
            style={styles.descartarBtn}
            onPress={descartar}
            disabled={publicando}
          >
            <Text style={styles.descartarText}>Descartar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.publicarBtn,
              publicando && styles.publicarBtnDisabled
            ]}
            onPress={publicar}
            disabled={publicando}
          >
            {publicando ? (
              <ActivityIndicator color={Colors.background} size="small" />
            ) : (
              <Text style={styles.publicarText}>Publicar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  titulo: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 24
  },
  tipoRow: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2A2A2A'
  },
  tipoBtn: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center'
  },
  tipoBtnActivo: {
    backgroundColor: Colors.primary
  },
  tipoText: {
    color: Colors.textMuted,
    fontWeight: '700',
    fontSize: 14
  },
  tipoTextActivo: {
    color: Colors.background
  },
  archivoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 28
  },
  archivoBox: {
    width: 110,
    height: 110,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    overflow: 'hidden'
  },
  previewImagen: {
    width: '100%',
    height: '100%'
  },
  archivoInfo: {
    flex: 1,
    gap: 10
  },
  archivoNombre: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 15
  },
  sustituirBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start'
  },
  sustituirText: {
    color: Colors.background,
    fontWeight: '800',
    fontSize: 13
  },
  imagenBtn: {
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start'
  },
  imagenBtnText: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 13
  },
  label: {
    color: Colors.text,
    fontWeight: '800',
    fontSize: 15,
    marginBottom: 8
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    color: Colors.text,
    fontSize: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20
  },
  inputMultiline: {
    height: 110,
    paddingTop: 12
  },
  previewCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10
  },
  previewAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21
  },
  previewAutor: {
    color: Colors.text,
    fontWeight: '800',
    fontSize: 14
  },
  badgeMusico: {
    backgroundColor: '#F9B233',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 3,
    alignSelf: 'flex-start'
  },
  badgeText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '700'
  },
  previewTitulo: {
    color: Colors.text,
    fontWeight: '800',
    fontSize: 15,
    marginBottom: 6
  },
  previewDescripcion: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10
  },
  previewPostImagen: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 10
  },
  audioPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 10
  },
  audioPreviewText: {
    flex: 1,
    color: Colors.text,
    fontSize: 13
  },
  botonesRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32
  },
  descartarBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center'
  },
  descartarText: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 15
  },
  publicarBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center'
  },
  publicarBtnDisabled: {
    backgroundColor: Colors.border
  },
  publicarText: {
    color: Colors.background,
    fontWeight: '800',
    fontSize: 15
  },
});