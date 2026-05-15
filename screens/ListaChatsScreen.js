import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Image, ActivityIndicator
} from 'react-native';
import { Colors } from '../constants/colors';
import Header from '../components/Header';
import { API_URL } from '../api/api';

const imgLolito = require('../assets/lolitosinclair.jpg');
const imgRlnZu = require('../assets/RlnZu.jpeg');
const imgVampira = require('../assets/Vampira.jpeg');
const imgCuchas = require('../assets/cuchas.jpeg');
const imgDiamante = require('../assets/Diamanteelectrico.jpeg');
const imgK93 = require('../assets/k93.png');
const imgSaikoro = require('../assets/saikoro.png');

const chatsBase = [
  {
    id: 'local-k93',
    nombreContacto: 'K93',
    ultimoMensaje: 'El 2 de mayo en Acto Latino!',
    horaUltimoMensaje: '1:05PM',
    noLeidos: 0,
    estado: 'En línea'
  },
  {
    id: 'local-saikoro',
    nombreContacto: 'Saikoro!',
    ultimoMensaje: 'Gracias por el apoyo!',
    horaUltimoMensaje: '12:30PM',
    noLeidos: 0,
    estado: 'En línea'
  },
  {
    id: 'local-lolito',
    nombreContacto: 'Lolito Sinclair',
    ultimoMensaje: 'Dale, con gusto!',
    horaUltimoMensaje: 'Ayer',
    noLeidos: 0,
    estado: 'En línea'
  },
  {
    id: 'local-rlnzu',
    nombreContacto: 'RlnZu',
    ultimoMensaje: 'Nueva canción pronto',
    horaUltimoMensaje: 'Lun',
    noLeidos: 0,
    estado: 'En línea'
  },
  {
    id: 'local-vampira',
    nombreContacto: 'Vampira',
    ultimoMensaje: 'Gracias por escucharnos!',
    horaUltimoMensaje: 'Lun',
    noLeidos: 0,
    estado: 'En línea'
  },
  {
    id: 'local-cuchas',
    nombreContacto: 'CUCHAS',
    ultimoMensaje: 'Ensayo este sábado',
    horaUltimoMensaje: 'Dom',
    noLeidos: 0,
    estado: 'En línea'
  },
  {
    id: 'local-diamante',
    nombreContacto: 'Diamante Eléctrico',
    ultimoMensaje: 'Kamikaze ya está disponible!',
    horaUltimoMensaje: 'Dom',
    noLeidos: 0,
    estado: 'En línea'
  },
];

const normalizarNombre = (nombre) => {
  return (nombre || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const obtenerImagenChat = (nombre) => {
  const n = normalizarNombre(nombre);

  if (n.includes('k93')) return imgK93;
  if (n.includes('saikoro')) return imgSaikoro;
  if (n.includes('lolito')) return imgLolito;
  if (n.includes('rlnzu')) return imgRlnZu;
  if (n.includes('vampira')) return imgVampira;
  if (n.includes('cuchas')) return imgCuchas;
  if (n.includes('diamante')) return imgDiamante;

  return imgK93;
};

const calcularNoLeidosReales = (mensajes = [], noLeidosBackend = 0) => {
  const mensajesNoLeidos = mensajes.filter(m => !m.mio && !m.leido).length;

  if (mensajesNoLeidos > 0) {
    return mensajesNoLeidos;
  }

  return noLeidosBackend || 0;
};

const prepararChat = (chat) => {
  const nombre = chat.nombreContacto || chat.nombre || 'K93';
  const mensajes = chat.mensajes || [];

  return {
    ...chat,
    id: chat._id || chat.id,
    _id: chat._id,
    esDeMongo: !!chat._id,
    nombre,
    nombreContacto: nombre,
    imagen: obtenerImagenChat(nombre),
    ultimoMensaje: chat.ultimoMensaje || chat.ultimo || 'Sin mensajes todavía',
    horaUltimoMensaje: chat.horaUltimoMensaje || chat.hora || '',
    noLeidos: calcularNoLeidosReales(mensajes, chat.noLeidos),
    estado: chat.estado || 'En línea',
    mensajes
  };
};

const quitarDuplicadosPorNombre = (lista) => {
  const vistos = new Set();
  const resultado = [];

  lista.forEach((chat) => {
    const nombreNormalizado = normalizarNombre(chat.nombreContacto);

    if (!vistos.has(nombreNormalizado)) {
      vistos.add(nombreNormalizado);
      resultado.push(chat);
    }
  });

  return resultado;
};

const ordenarChats = (lista) => {
  const ordenDeseado = [
    'k93',
    'saikoro',
    'lolito sinclair',
    'rlnzu',
    'vampira',
    'cuchas',
    'diamante electrico'
  ];

  return [...lista].sort((a, b) => {
    const aNombre = normalizarNombre(a.nombreContacto);
    const bNombre = normalizarNombre(b.nombreContacto);

    const aIndex = ordenDeseado.indexOf(aNombre);
    const bIndex = ordenDeseado.indexOf(bNombre);

    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });
};

export default function ListaChatsScreen({ onClose, onSelectChat }) {
  const [chats, setChats] = useState(ordenarChats(chatsBase.map(prepararChat)));
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarChats();
  }, []);

  const cargarChats = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch(`${API_URL}/chats`);
      const data = await respuesta.json();

      const chatsBackend = (data.data || []).map(prepararChat);
      const chatsLocales = chatsBase.map(prepararChat);

      const mezcla = quitarDuplicadosPorNombre([
        ...chatsBackend,
        ...chatsLocales
      ]);

      setChats(ordenarChats(mezcla));
    } catch (error) {
      console.log('Error cargando chats:', error);
      setChats(ordenarChats(chatsBase.map(prepararChat)));
    } finally {
      setCargando(false);
    }
  };

  const abrirChat = async (chat) => {
    setChats(prev =>
      prev.map(c =>
        (c.id === chat.id || c._id === chat._id)
          ? { ...c, noLeidos: 0 }
          : c
      )
    );

    if (chat._id) {
      try {
        await fetch(`${API_URL}/chats/${chat._id}/leido`, {
          method: 'PUT'
        });
      } catch (error) {
        console.log('Error marcando chat como leído:', error);
      }
    }

    onSelectChat({
      ...chat,
      noLeidos: 0
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={onClose} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>Mensajes</Text>

        {cargando && (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.loadingText}>Cargando mensajes...</Text>
          </View>
        )}

        {chats.map(c => (
          <TouchableOpacity
            key={c.id || c._id || c.nombreContacto}
            style={styles.chatCard}
            onPress={() => abrirChat(c)}
          >
            <View style={styles.avatarWrapper}>
              <Image source={c.imagen} style={styles.avatar} />
              <View style={styles.onlineDot} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.nombre}>{c.nombreContacto}</Text>
              <Text style={styles.ultimo} numberOfLines={1}>
                {c.ultimoMensaje}
              </Text>
            </View>

            <View style={styles.right}>
              <Text style={styles.hora}>{c.horaUltimoMensaje}</Text>

              {c.noLeidos > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{c.noLeidos}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },

  scroll: { 
    padding: 16 
  },

  titulo: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: 0.5
  },

  loadingBox: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },

  loadingText: {
    color: Colors.textMuted,
    fontSize: 13
  },

  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },

  avatarWrapper: { 
    position: 'relative' 
  },

  avatar: { 
    width: 52, 
    height: 52, 
    borderRadius: 26 
  },

  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: Colors.background
  },

  nombre: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 15
  },

  ultimo: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 3
  },

  right: {
    alignItems: 'flex-end',
    gap: 6
  },

  hora: {
    color: Colors.textMuted,
    fontSize: 11
  },

  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5
  },

  badgeText: {
    color: Colors.background,
    fontSize: 11,
    fontWeight: '700'
  },
});