import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput,
  KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { Colors } from '../constants/colors';
import Header from '../components/Header';

const imgSinValor = require('../assets/foto_artista.png');
const imgLuci = require('../assets/luci.png');
const imgLuisJ = require('../assets/luisj_intercambios.png');
const imgJose = require('../assets/jose_intercambios.png');
const imgMarianaG = require('../assets/marianag.jpg');
const imgElKraken = require('../assets/elkraken.jpg');
const imgSofiaM = require('../assets/sofiam.jpg');

const Estrellas = ({ cantidad, size = 16 }) => (
  <Text style={{ fontSize: size, color: Colors.primary }}>
    {'★'.repeat(cantidad)}{'☆'.repeat(5 - cantidad)}
  </Text>
);

const obtenerImagenUsuario = (usuario, index = 0) => {
  const usuarioNormalizado = usuario?.toLowerCase() || '';

  if (usuarioNormalizado.includes('sin valor')) return imgSinValor;

  if (usuarioNormalizado.includes('maria') || usuarioNormalizado.includes('maría')) return imgMarianaG;
  if (usuarioNormalizado.includes('angie') || usuarioNormalizado.includes('luci')) return imgLuci;
  if (usuarioNormalizado.includes('juan') || usuarioNormalizado.includes('jose') || usuarioNormalizado.includes('josé')) return imgJose;
  if (usuarioNormalizado.includes('camilo') || usuarioNormalizado.includes('diego')) return imgElKraken;
  if (usuarioNormalizado.includes('sara') || usuarioNormalizado.includes('nata') || usuarioNormalizado.includes('lina')) return imgSofiaM;
  if (usuarioNormalizado.includes('luis')) return imgLuisJ;

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

const normalizarBadge = (badge, usuario) => {
  const usuarioNormalizado = usuario?.toLowerCase() || '';
  const badgeNormalizado = badge?.toLowerCase() || '';

  if (usuarioNormalizado.includes('sin valor')) return 'Músico';
  if (badgeNormalizado.includes('músico') || badgeNormalizado.includes('musico')) return 'Músico';
  if (badgeNormalizado.includes('artista')) return 'Músico';
  if (badgeNormalizado.includes('oyente')) return 'Oyente';
  if (badgeNormalizado.includes('asistente')) return 'Oyente';

  return 'Oyente';
};

export default function PostScreen({ reseña, resenia, onBack }) {
  const reseñaRecibida = reseña || resenia;

  const post = reseñaRecibida ?? {
    usuario: 'MARÍA',
    badge: 'Oyente',
    texto: 'Los artistas se presentaron muy tarde, los precios son muy caros',
    estrellas: 3,
    fecha: '26/04/2026',
    hora: '1:05PM',
    likes: 67,
    comentarios: [],
    imagen: imgMarianaG
  };

  const badgePost = normalizarBadge(post.badge, post.usuario);
  const imagenPost = post.imagen || obtenerImagenUsuario(post.usuario);

  const comentariosIniciales = (post.comentarios || []).map((c, index) => {
    const usuarioComentario = c.usuario || c.autor || 'Usuario';
    const badgeComentario = normalizarBadge(c.badge || c.rol, usuarioComentario);

    return {
      id: c._id || `c${index}`,
      usuario: usuarioComentario,
      badge: badgeComentario,
      texto: c.texto,
      imagen: obtenerImagenUsuario(usuarioComentario, index)
    };
  });

  const [comentarios, setComentarios] = useState(comentariosIniciales);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes ?? 67);

  const handleEnviar = () => {
    if (!nuevoComentario.trim()) return;

    const nuevo = {
      id: `c${Date.now()}`,
      usuario: 'SIN VALOR',
      badge: 'Músico',
      texto: nuevoComentario.trim(),
      imagen: imgSinValor
    };

    setComentarios(prev => [...prev, nuevo]);
    setNuevoComentario('');
  };

  const handleLike = () => {
    setLiked(prev => !prev);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={onBack} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>POST</Text>

          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image source={imagenPost} style={styles.avatar} />

              <View>
                <Text style={styles.postUsuario}>{post.usuario}</Text>

                <View style={badgePost === 'Oyente' ? styles.badgeOyente : styles.badgeMusico}>
                  <Text style={styles.badgeText}>{badgePost}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.postTexto}>{post.texto}</Text>

            <View style={styles.postMeta}>
              <Estrellas cantidad={post.estrellas} size={14} />
              <Text style={styles.postFecha}>{post.fecha} • {post.hora}</Text>
            </View>

            <View style={styles.postAcciones}>
              <TouchableOpacity style={styles.accionBtn} onPress={handleLike}>
                <Text style={[styles.accionIcon, liked && styles.likedIcon]}>♥</Text>
                <Text style={styles.accionCount}>{likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.accionBtn}>
                <Text style={styles.accionIcon}>●●●</Text>
                <Text style={styles.accionCount}>{comentarios.length}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {comentarios.map(c => (
            <View key={c.id} style={styles.comentarioCard}>
              <Image source={c.imagen} style={styles.avatarSmall} />

              <View style={{ flex: 1 }}>
                <View style={styles.comentarioHeader}>
                  <Text style={styles.comentarioUsuario}>{c.usuario}</Text>

                  <View style={c.badge === 'Oyente' ? styles.badgeOyente : styles.badgeMusico}>
                    <Text style={styles.badgeText}>{c.badge}</Text>
                  </View>
                </View>

                <Text style={styles.comentarioTexto}>{c.texto}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.inputComentario}
            placeholder="Comentar..."
            placeholderTextColor={Colors.textMuted}
            value={nuevoComentario}
            onChangeText={setNuevoComentario}
            returnKeyType="send"
            onSubmitEditing={handleEnviar}
          />

          <TouchableOpacity
            style={[styles.enviarBtn, nuevoComentario.trim() && styles.enviarBtnActivo]}
            onPress={handleEnviar}
          >
            <Text style={styles.enviarIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },

  scroll: { 
    padding: 16, 
    paddingBottom: 8 
  },

  titulo: { 
    color: Colors.text, 
    fontSize: 22, 
    fontWeight: '900', 
    marginBottom: 14 
  },

  postCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16
  },

  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.border
  },

  postUsuario: {
    color: Colors.text,
    fontWeight: '800',
    fontSize: 14
  },

  postTexto: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10
  },

  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12
  },

  postFecha: {
    color: Colors.textMuted,
    fontSize: 11
  },

  postAcciones: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10
  },

  accionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },

  accionIcon: {
    color: Colors.textMuted,
    fontSize: 14
  },

  likedIcon: {
    color: '#FF4D6D'
  },

  accionCount: {
    color: Colors.textMuted,
    fontSize: 13
  },

  badgeMusico: {
    backgroundColor: '#F9B233',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 3,
    alignSelf: 'flex-start'
  },

  badgeOyente: {
    backgroundColor: '#4A8AF0',
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

  comentarioCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8
  },

  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.border,
    marginTop: 2
  },

  comentarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },

  comentarioUsuario: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 13
  },

  comentarioTexto: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  },

  inputComentario: {
    flex: 1,
    backgroundColor: Colors.input,
    color: Colors.text,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14
  },

  enviarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center'
  },

  enviarBtnActivo: {
    backgroundColor: Colors.primary
  },

  enviarIcon: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16
  },
});