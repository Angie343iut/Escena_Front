import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput, Image, ActivityIndicator, Alert
} from 'react-native';
import { Colors } from '../constants/colors';
import { API_URL } from '../api/api';

const imgSinValor = require('../assets/foto_artista.png');
const imgLolito = require('../assets/lolitosinclair.jpg');
const imgRlnZu = require('../assets/RlnZu.jpeg');
const imgVampira = require('../assets/Vampira.jpeg');
const imgCuchas = require('../assets/cuchas.jpeg');
const imgDiamante = require('../assets/Diamanteelectrico.jpeg');
const imgK93 = require('../assets/k93.png');
const imgSaikoro = require('../assets/saikoro.png');

const mensajesBasePorChat = {
  k93: [
    { id: 'base-k93-1', texto: 'Hola! me encanta tu música', mio: true, leido: true, hora: '6:40 PM' },
    { id: 'base-k93-2', texto: 'Gracias! nos alegra mucho', mio: false, leido: true, hora: '6:40 PM' },
    { id: 'base-k93-3', texto: '¿Cuándo es el próximo toque?', mio: true, leido: true, hora: '6:40 PM' },
    { id: 'base-k93-4', texto: 'El 2 de mayo en Acto Latino!', mio: false, leido: true, hora: '6:40 PM' },
  ],
  saikoro: [
    { id: 'base-saikoro-1', texto: 'Acá el frío es peor está muy buena', mio: true, leido: true, hora: '5:10 PM' },
    { id: 'base-saikoro-2', texto: 'Gracias por escucharla!', mio: false, leido: true, hora: '5:12 PM' },
  ],
  'lolito sinclair': [
    { id: 'base-lolito-1', texto: 'Me gustó mucho el proyecto', mio: true, leido: true, hora: '4:20 PM' },
    { id: 'base-lolito-2', texto: 'Dale, con gusto!', mio: false, leido: true, hora: '4:24 PM' },
  ],
  rlnzu: [
    { id: 'base-rlnzu-1', texto: '¿Vas a sacar canción nueva?', mio: true, leido: true, hora: '3:30 PM' },
    { id: 'base-rlnzu-2', texto: 'Nueva canción pronto', mio: false, leido: true, hora: '3:31 PM' },
  ],
  vampira: [
    { id: 'base-vampira-1', texto: 'Vampira 911 está brutal', mio: true, leido: true, hora: '2:00 PM' },
    { id: 'base-vampira-2', texto: 'Gracias por escucharnos!', mio: false, leido: true, hora: '2:04 PM' },
  ],
  cuchas: [
    { id: 'base-cuchas-1', texto: '¿Cuándo ensayan?', mio: true, leido: true, hora: '1:10 PM' },
    { id: 'base-cuchas-2', texto: 'Ensayo este sábado', mio: false, leido: true, hora: '1:11 PM' },
  ],
  'diamante electrico': [
    { id: 'base-diamante-1', texto: 'Kamikaze está buenísima', mio: true, leido: true, hora: '12:10 PM' },
    { id: 'base-diamante-2', texto: 'Kamikaze ya está disponible!', mio: false, leido: true, hora: '12:12 PM' },
  ],
};

const normalizarNombre = (nombre) => {
  return (nombre || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const obtenerImagenChat = (nombre) => {
  const n = normalizarNombre(nombre);

  if (n.includes('sin valor')) return imgSinValor;
  if (n.includes('k93')) return imgK93;
  if (n.includes('saikoro')) return imgSaikoro;
  if (n.includes('lolito')) return imgLolito;
  if (n.includes('rlnzu')) return imgRlnZu;
  if (n.includes('vampira')) return imgVampira;
  if (n.includes('cuchas')) return imgCuchas;
  if (n.includes('diamante')) return imgDiamante;

  return imgK93;
};

const mensajesBasePara = (nombre) => {
  const n = normalizarNombre(nombre);
  return mensajesBasePorChat[n] || mensajesBasePorChat.k93;
};

const mensajeBackendAEstado = (m) => ({
  id: m._id || m.id || `${Date.now()}-${Math.random()}`,
  texto: m.texto,
  mio: !!m.mio,
  leido: !!m.leido,
  hora: m.hora || ''
});

const mensajeEstadoABackend = (m, nombreArtista) => ({
  emisor: m.mio ? 'SIN VALOR' : nombreArtista,
  texto: m.texto,
  mio: !!m.mio,
  leido: true,
  hora: m.hora || ''
});

export default function ChatScreen({ artista, onClose, onBack }) {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [chatId, setChatId] = useState(artista?._id || artista?.id || null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const scrollRef = useRef(null);

  const nombreArtista = artista?.nombreContacto || artista?.nombre || 'K93';
  const fotoArtista = artista?.imagen || obtenerImagenChat(nombreArtista);

  const esChatLocal = (id) => String(id || '').startsWith('local-');

  useEffect(() => {
    cargarChat();
  }, []);

  const cargarChat = async () => {
    if (!chatId || esChatLocal(chatId)) {
      setMensajes(mensajesBasePara(nombreArtista));
      setCargando(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
      return;
    }

    try {
      setCargando(true);

      const respuesta = await fetch(`${API_URL}/chats/${chatId}`);
      const data = await respuesta.json();

      if (!respuesta.ok) {
        setMensajes(mensajesBasePara(nombreArtista));
        return;
      }

      const mensajesBackend = (data.data?.mensajes || []).map(mensajeBackendAEstado);

      if (mensajesBackend.length > 0) {
        setMensajes(mensajesBackend);
      } else {
        setMensajes(mensajesBasePara(nombreArtista));
      }

      await fetch(`${API_URL}/chats/${chatId}/leido`, {
        method: 'PUT'
      });
    } catch (error) {
      console.log('Error cargando chat:', error);
      setMensajes(mensajesBasePara(nombreArtista));
    } finally {
      setCargando(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
    }
  };

  const crearChatConMensajesBase = async (mensajeNuevo) => {
    const base = mensajesBasePara(nombreArtista);

    const mensajesParaGuardar = [
      ...base.map((m) => mensajeEstadoABackend(m, nombreArtista)),
      mensajeNuevo
    ];

    const respuesta = await fetch(`${API_URL}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombreContacto: nombreArtista,
        imagenUrl: nombreArtista,
        ultimoMensaje: mensajeNuevo.texto,
        horaUltimoMensaje: mensajeNuevo.hora,
        noLeidos: 0,
        estado: 'En línea',
        mensajes: mensajesParaGuardar
      })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(data.mensaje || 'No se pudo crear el chat');
    }

    const nuevoId = data.data._id;
    setChatId(nuevoId);

    return nuevoId;
  };

  const agregarMensajeAChatExistente = async (idReal, mensajeNuevo) => {
    const respuesta = await fetch(`${API_URL}/chats/${idReal}/mensajes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mensajeNuevo)
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(data.mensaje || 'No se pudo guardar el mensaje.');
    }

    return data;
  };

  const enviar = async () => {
    if (!texto.trim() || enviando) return;

    const textoMensaje = texto.trim();

    const hora = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const mensajeLocal = {
      id: Date.now().toString(),
      emisor: 'SIN VALOR',
      texto: textoMensaje,
      mio: true,
      leido: true,
      hora
    };

    const mensajeParaBackend = {
      emisor: 'SIN VALOR',
      texto: textoMensaje,
      mio: true,
      leido: true,
      hora
    };

    setMensajes(prev => [...prev, mensajeLocal]);
    setTexto('');

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      setEnviando(true);

      if (!chatId || esChatLocal(chatId)) {
        await crearChatConMensajesBase(mensajeParaBackend);
      } else {
        await agregarMensajeAChatExistente(chatId, mensajeParaBackend);
      }
    } catch (error) {
      console.log('Error enviando mensaje:', error);
      Alert.alert('Error', 'No se pudo guardar el mensaje en la base de datos.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={onBack || onClose} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.avatarWrapper}>
          <Image source={fotoArtista} style={styles.avatar} />
          <View style={styles.onlineDot} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.nombre}>{nombreArtista}</Text>
          <Text style={styles.estado}>En línea</Text>
        </View>
      </View>

      {cargando ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando conversación...</Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.mensajes}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {mensajes.map(m => (
            <View
              key={m.id}
              style={[
                styles.bubbbleRow,
                m.mio ? styles.rowMio : styles.rowEllos
              ]}
            >
              <View
                style={[
                  styles.burbuja,
                  m.mio ? styles.burbujaM : styles.burbujaE
                ]}
              >
                <Text style={[styles.burbujaTexto, !m.mio && styles.burbujaTextoE]}>
                  {m.texto}
                </Text>

                {m.hora && (
                  <Text style={[styles.horaMsg, !m.mio && styles.horaMsgE]}>
                    {m.hora}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={Colors.textMuted}
          value={texto}
          onChangeText={setTexto}
          onSubmitEditing={enviar}
          returnKeyType="send"
          editable={!enviando}
        />

        <TouchableOpacity
          style={[styles.enviarBtn, enviando && styles.enviarBtnDisabled]}
          onPress={enviar}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator color={Colors.background} size="small" />
          ) : (
            <Text style={styles.enviarIcon}>↑</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  backBtn: { paddingRight: 4 },
  backIcon: { color: Colors.text, fontSize: 22 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: Colors.background
  },
  nombre: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 16
  },
  estado: {
    color: '#4CD964',
    fontSize: 12,
    marginTop: 1
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13
  },
  mensajes: {
    padding: 16,
    paddingBottom: 8
  },
  bubbbleRow: {
    marginBottom: 10
  },
  rowMio: {
    alignItems: 'flex-end'
  },
  rowEllos: {
    alignItems: 'flex-start'
  },
  burbuja: {
    maxWidth: '75%',
    borderRadius: 18,
    padding: 12
  },
  burbujaM: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4
  },
  burbujaE: {
    backgroundColor: '#1E1E1E',
    borderBottomLeftRadius: 4
  },
  burbujaTexto: {
    color: Colors.background,
    fontSize: 14,
    lineHeight: 20
  },
  burbujaTextoE: {
    color: Colors.text
  },
  horaMsg: {
    color: 'rgba(0,0,0,0.45)',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right'
  },
  horaMsgE: {
    color: Colors.textMuted,
    textAlign: 'left'
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border
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
    borderColor: Colors.border
  },
  enviarBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 22,
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center'
  },
  enviarBtnDisabled: {
    backgroundColor: Colors.border
  },
  enviarIcon: {
    color: Colors.background,
    fontWeight: '800',
    fontSize: 18
  },
});