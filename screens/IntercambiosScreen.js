import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput, Modal, Image, ActivityIndicator, Alert
} from 'react-native';
import { Colors } from '../constants/colors';
import Header from '../components/Header';
import { API_URL } from '../api/api';

const imgLuci = require('../assets/luci.png');
const imgLuisJ = require('../assets/luisj_intercambios.png');
const imgJose = require('../assets/jose_intercambios.png');
const imgMarianaG = require('../assets/marianag.jpg');
const imgElKraken = require('../assets/elkraken.jpg');
const imgSofiaM = require('../assets/sofiam.jpg');
const imgSinValor = require('../assets/foto_artista.png');

const imagenesIntercambio = [
  imgLuci,
  imgLuisJ,
  imgJose,
  imgMarianaG,
  imgElKraken,
  imgSofiaM,
];

const obtenerImagenLocal = (usuario, index = 0) => {
  const usuarioNormalizado = usuario?.toLowerCase() || '';

  if (usuarioNormalizado.includes('sin valor')) return imgSinValor;
  if (usuarioNormalizado.includes('luci')) return imgLuci;
  if (usuarioNormalizado.includes('luis')) return imgLuisJ;
  if (usuarioNormalizado.includes('josé') || usuarioNormalizado.includes('jose')) return imgJose;
  if (usuarioNormalizado.includes('mariana')) return imgMarianaG;
  if (usuarioNormalizado.includes('kraken')) return imgElKraken;
  if (usuarioNormalizado.includes('sofía') || usuarioNormalizado.includes('sofia')) return imgSofiaM;

  return imagenesIntercambio[index % imagenesIntercambio.length];
};

const FILTROS = [
  { label: 'Todo', valor: 'Todo' },
  { label: 'Producción', valor: 'Producción' },
  { label: 'Mezcla', valor: 'Mezcla' },
  { label: 'Diseño', valor: 'Diseño' },
  { label: 'Vocal', valor: 'Vocal' },
  { label: 'Letra', valor: 'Letra' },
  { label: 'Video', valor: 'Video' },
  { label: 'Fotografía', valor: 'Fotografía' },
  { label: 'Clases', valor: 'Clases' },
];

export default function IntercambiosScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [queBuscas, setQueBuscas] = useState('');
  const [queOfreces, setQueOfreces] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tiempo, setTiempo] = useState('1 Día');
  const [filtro, setFiltro] = useState('Todo');
  const [busqueda, setBusqueda] = useState('');
  const [intercambios, setIntercambios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [publicando, setPublicando] = useState(false);

  useEffect(() => {
    cargarIntercambios();
  }, []);

  const cargarIntercambios = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch(`${API_URL}/intercambios`);
      const data = await respuesta.json();

      const intercambiosBackend = (data.data || []).map((item, index) => ({
        id: item._id,
        _id: item._id,
        usuario: item.usuario,
        imagen: obtenerImagenLocal(item.usuario, index),
        tiempo: item.createdAt ? 'Publicado recientemente' : 'Reciente',
        ubicacion: item.ubicacion,
        categoria: item.categoria,
        ofrezco: item.ofrezco,
        busco: item.busco,
        descripcion: item.descripcion,
        estado: item.estado,
      }));

      setIntercambios(intercambiosBackend);
    } catch (error) {
      console.log('Error cargando intercambios:', error);
      Alert.alert('Error', 'No se pudieron cargar los intercambios.');
    } finally {
      setCargando(false);
    }
  };

  const publicarIntercambio = async () => {
    if (!queBuscas.trim() || !queOfreces.trim() || !descripcion.trim()) {
      Alert.alert(
        'Campos incompletos',
        'Debes completar qué buscas, qué ofreces y la descripción.'
      );
      return;
    }

    try {
      setPublicando(true);

      const nuevoIntercambio = {
        usuario: 'SIN VALOR',
        categoria: 'Producción',
        ofrezco: queOfreces.trim(),
        busco: queBuscas.trim(),
        descripcion: `${descripcion.trim()} Tiempo estimado: ${tiempo}.`,
        ubicacion: 'Bogotá · Colombia',
        imagenUrl: '',
        estado: 'Abierto'
      };

      const respuesta = await fetch(`${API_URL}/intercambios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoIntercambio)
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        Alert.alert('Error', data.mensaje || 'No se pudo publicar el intercambio.');
        return;
      }

      setQueBuscas('');
      setQueOfreces('');
      setDescripcion('');
      setTiempo('1 Día');
      setModalVisible(false);

      await cargarIntercambios();

      Alert.alert('Publicado', 'El intercambio fue publicado correctamente.');
    } catch (error) {
      console.log('Error publicando intercambio:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setPublicando(false);
    }
  };

  const intercambiosFiltrados = intercambios.filter(i => {
    const matchFiltro = filtro === 'Todo' || i.categoria === filtro;
    const textoBusqueda = busqueda.toLowerCase();

    const matchBusqueda = busqueda === '' ||
      i.usuario.toLowerCase().includes(textoBusqueda) ||
      i.ofrezco.toLowerCase().includes(textoBusqueda) ||
      i.busco.toLowerCase().includes(textoBusqueda) ||
      i.descripcion.toLowerCase().includes(textoBusqueda);

    return matchFiltro && matchBusqueda;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>INTERCAMBIOS</Text>

        <View style={styles.buscadorRow}>
          <TextInput
            style={styles.buscador}
            placeholder="Buscar..."
            placeholderTextColor={Colors.textMuted}
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtrosScroll}
          contentContainerStyle={styles.filtrosRow}
        >
          {FILTROS.map(f => (
            <TouchableOpacity
              key={f.valor}
              style={[styles.filtroBtn, filtro === f.valor && styles.filtroActivo]}
              onPress={() => setFiltro(f.valor)}
            >
              <Text style={[styles.filtroText, filtro === f.valor && styles.filtroTextActivo]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.publicarBanner} onPress={() => setModalVisible(true)}>
          <Text style={styles.publicarTexto}>
            ¿Tienes algo que ofrecer?{'\n'}Publica tu intercambio
          </Text>
          <View style={styles.plusBtn}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.subtitulo}>
          {filtro === 'Todo' ? 'Recientes' : filtro}
          {intercambiosFiltrados.length > 0 ? ` · ${intercambiosFiltrados.length}` : ''}
        </Text>

        {cargando && (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.loadingText}>Cargando intercambios...</Text>
          </View>
        )}

        {!cargando && intercambiosFiltrados.length === 0 && (
          <Text style={styles.sinResultados}>
            No hay intercambios en esta categoría todavía.
          </Text>
        )}

        {!cargando && intercambiosFiltrados.map(i => (
          <View key={i.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image source={i.imagen} style={styles.avatar} />

              <View style={{ flex: 1 }}>
                <Text style={styles.cardUsuario}>{i.usuario}</Text>
                <Text style={styles.cardSub}>{i.tiempo} · {i.ubicacion}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.categoriaBadge,
                  filtro === i.categoria && styles.categoriaBadgeActivo
                ]}
                onPress={() => setFiltro(i.categoria)}
              >
                <Text
                  style={[
                    styles.categoriaText,
                    filtro === i.categoria && styles.categoriaTextActivo
                  ]}
                >
                  {i.categoria}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.intercambioRow}>
              <View style={styles.intercambioBox}>
                <Text style={styles.intercambioLabel}>OFREZCO</Text>
                <Text style={styles.intercambioValor}>{i.ofrezco}</Text>
              </View>

              <Text style={styles.flecha}>⇄</Text>

              <View style={styles.intercambioBox}>
                <Text style={styles.intercambioLabel}>BUSCO</Text>
                <Text style={styles.intercambioValor}>{i.busco}</Text>
              </View>
            </View>

            <Text style={styles.cardDesc}>{i.descripcion}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.estadoText}>● {i.estado}</Text>

              <TouchableOpacity style={styles.aceptarBtn}>
                <Text style={styles.aceptarText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>PUBLICA TU INTERCAMBIO</Text>

            <Text style={styles.modalLabel}>¿Qué buscas?</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Escribe tu respuesta..."
              placeholderTextColor={Colors.textMuted}
              value={queBuscas}
              onChangeText={setQueBuscas}
            />

            <Text style={styles.modalLabel}>¿Qué ofreces?</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Escribe tu respuesta..."
              placeholderTextColor={Colors.textMuted}
              value={queOfreces}
              onChangeText={setQueOfreces}
            />

            <Text style={styles.modalLabel}>Descripción del intercambio</Text>
            <TextInput
              style={[styles.modalInput, { height: 80 }]}
              placeholder="Escribe tu respuesta..."
              placeholderTextColor={Colors.textMuted}
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
            />

            <Text style={styles.modalLabel}>Tiempo del intercambio</Text>
            <View style={styles.tiempoRow}>
              {['1 Día', '1 Semana', '1 Mes', 'Personalizado'].map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.tiempoBtn, tiempo === t && styles.tiempoActivo]}
                  onPress={() => setTiempo(t)}
                >
                  <Text style={[styles.tiempoText, tiempo === t && { color: Colors.background }]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelarBtn}
                onPress={() => setModalVisible(false)}
                disabled={publicando}
              >
                <Text style={styles.cancelarText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.publicarBtn,
                  publicando && styles.publicarBtnDesactivado
                ]}
                onPress={publicarIntercambio}
                disabled={publicando}
              >
                {publicando ? (
                  <ActivityIndicator color={Colors.background} />
                ) : (
                  <Text style={styles.publicarBtnText}>Publicar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 16
  },
  buscadorRow: { marginBottom: 12 },
  buscador: {
    backgroundColor: Colors.input,
    color: Colors.text,
    borderRadius: 8,
    padding: 12,
    fontSize: 14
  },
  filtrosScroll: { marginBottom: 16 },
  filtrosRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16
  },
  filtroBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card
  },
  filtroActivo: { backgroundColor: Colors.primary },
  filtroText: {
    color: Colors.textMuted,
    fontWeight: '600',
    fontSize: 13
  },
  filtroTextActivo: { color: Colors.background },
  publicarBanner: {
    backgroundColor: '#2A3A1A',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  publicarTexto: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 14
  },
  plusBtn: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  plusText: {
    color: Colors.background,
    fontSize: 20,
    fontWeight: '900'
  },
  subtitulo: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10
  },
  loadingBox: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13
  },
  sinResultados: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  cardUsuario: {
    color: Colors.text,
    fontWeight: '700'
  },
  cardSub: {
    color: Colors.textMuted,
    fontSize: 11
  },
  categoriaBadge: {
    backgroundColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  categoriaBadgeActivo: {
    backgroundColor: Colors.primary
  },
  categoriaText: {
    color: Colors.text,
    fontSize: 11
  },
  categoriaTextActivo: {
    color: Colors.background,
    fontWeight: '700'
  },
  intercambioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  intercambioBox: {
    flex: 1,
    backgroundColor: Colors.border,
    borderRadius: 8,
    padding: 10
  },
  intercambioLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700'
  },
  intercambioValor: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 13
  },
  flecha: {
    color: Colors.text,
    fontSize: 20
  },
  cardDesc: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 10
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  estadoText: {
    color: Colors.primary,
    fontSize: 12
  },
  aceptarBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  aceptarText: {
    color: Colors.background,
    fontWeight: '800'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end'
  },
  modalBox: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24
  },
  modalTitulo: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 16
  },
  modalLabel: {
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 6
  },
  modalInput: {
    backgroundColor: Colors.input,
    color: Colors.text,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14
  },
  tiempoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20
  },
  tiempoBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.border
  },
  tiempoActivo: {
    backgroundColor: Colors.primary
  },
  tiempoText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600'
  },
  modalBtns: {
    flexDirection: 'row',
    gap: 12
  },
  cancelarBtn: {
    flex: 1,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center'
  },
  cancelarText: {
    color: Colors.text,
    fontWeight: '700'
  },
  publicarBtn: {
    flex: 1,
    borderRadius: 8,
    padding: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center'
  },
  publicarBtnDesactivado: {
    backgroundColor: Colors.border
  },
  publicarBtnText: {
    color: Colors.background,
    fontWeight: '800'
  },
});