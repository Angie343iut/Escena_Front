import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput,
  Linking, Switch, PanResponder, Dimensions, Image,
  ActivityIndicator, Alert
} from 'react-native';
import { Colors } from '../constants/colors';
import Header from '../components/Header';
import PostScreen from './PostScreen';
import { API_URL } from '../api/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 64;

const imgClubClandestino = require('../assets/lugarclubclandestino.png');
const imgElGoce = require('../assets/lugarelgoce.png');
const imgApache = require('../assets/lugarapache.png');
const imgMatik = require('../assets/lugarmatik.png');
const imgBarraBrava = require('../assets/lugarlabarrabrava.png');

const imgSinValor = require('../assets/foto_artista.png');
const imgLuci = require('../assets/luci.png');
const imgLuisJ = require('../assets/luisj_intercambios.png');
const imgJose = require('../assets/jose_intercambios.png');
const imgMarianaG = require('../assets/marianag.jpg');
const imgElKraken = require('../assets/elkraken.jpg');
const imgSofiaM = require('../assets/sofiam.jpg');

const GENEROS = ['Electronica', 'Rock', 'Metal', 'Rap', 'Jazz', 'Pop', 'Punk', 'Indie', 'Salsa', 'Otros'];
const PRECIOS = ['Gratis', '$50k', '$100k', '$150k', '$200k', '$250k'];
const DISTANCIAS = ['1km', '10km', '20km', '30km', '40km', '50km'];

const MAPA = {
  latMin: 4.575,
  latMax: 4.700,
  lngMin: -74.110,
  lngMax: -74.030,
  width: SCREEN_WIDTH - 32,
  height: 220,
};

const obtenerImagenLugar = (nombre) => {
  const nombreNormalizado = nombre?.toLowerCase() || '';

  if (nombreNormalizado.includes('club clandestino')) return imgClubClandestino;
  if (nombreNormalizado.includes('goce')) return imgElGoce;
  if (nombreNormalizado.includes('apache')) return imgApache;
  if (nombreNormalizado.includes('matik')) return imgMatik;
  if (nombreNormalizado.includes('barra')) return imgBarraBrava;

  return imgClubClandestino;
};

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

function lngToX(lng) {
  return ((lng - MAPA.lngMin) / (MAPA.lngMax - MAPA.lngMin)) * MAPA.width;
}

function latToY(lat) {
  return (1 - (lat - MAPA.latMin) / (MAPA.latMax - MAPA.latMin)) * MAPA.height;
}

const Estrellas = ({ cantidad, size = 14 }) => (
  <Text style={{ fontSize: size, color: Colors.primary }}>
    {'★'.repeat(Math.max(0, Math.round(cantidad)))}{'☆'.repeat(Math.max(0, 5 - Math.round(cantidad)))}
  </Text>
);

function MapaVisual({ onPinPress, lugaresFiltrados }) {
  const abrirMaps = () => {
    Linking.openURL('https://www.google.com/maps/search/bares+y+clubes+en+vivo/@4.6482837,-74.0742,13z');
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={abrirMaps} style={styles.mapaContainer}>
      <View style={styles.mapaFondo}>
        {[0.2, 0.4, 0.6, 0.8].map(p => (
          <View key={p} style={[styles.mapaLineaH, { top: `${p * 100}%` }]} />
        ))}

        {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map(p => (
          <View key={p} style={[styles.mapaLineaV, { left: `${p * 100}%` }]} />
        ))}

        {[
          { top: '10%', left: '8%', width: '18%', height: '12%' },
          { top: '10%', left: '32%', width: '12%', height: '8%' },
          { top: '10%', left: '60%', width: '20%', height: '15%' },
          { top: '28%', left: '5%', width: '22%', height: '10%' },
          { top: '28%', left: '45%', width: '15%', height: '12%' },
          { top: '28%', left: '70%', width: '18%', height: '10%' },
          { top: '46%', left: '15%', width: '20%', height: '14%' },
          { top: '46%', left: '50%', width: '12%', height: '10%' },
          { top: '46%', left: '72%', width: '16%', height: '14%' },
          { top: '66%', left: '5%', width: '25%', height: '12%' },
          { top: '66%', left: '38%', width: '18%', height: '10%' },
          { top: '66%', left: '65%', width: '22%', height: '14%' },
        ].map((b, i) => (
          <View key={i} style={[styles.mapaManzana, b]} />
        ))}

        {lugaresFiltrados.map(l => {
          const x = lngToX(l.lng);
          const y = latToY(l.lat);

          return (
            <TouchableOpacity
              key={l.id}
              onPress={(e) => {
                e.stopPropagation();
                onPinPress(l.id);
              }}
              style={[styles.mapaPin, { left: x - 6, top: y - 18 }]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={styles.mapaPinDot} />
              <View style={styles.mapaPinLabel}>
                <Text style={styles.mapaPinText} numberOfLines={1}>{l.nombre}</Text>
                <Text style={styles.mapaPinRating}>{'★'.repeat(Math.round(l.rating))}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.mapaFooterLabel}>
          <Text style={styles.mapaFooterText}>Toca para abrir en Maps</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function DragSlider({ value, onChange, steps }) {
  const currentIdx = useRef(value);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const x = evt.nativeEvent.locationX;
        const raw = Math.max(0, Math.min(SLIDER_WIDTH, x));
        const idx = Math.round((raw / SLIDER_WIDTH) * (steps.length - 1));
        currentIdx.current = idx;
        onChange(idx);
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX;
        const raw = Math.max(0, Math.min(SLIDER_WIDTH, x));
        const idx = Math.round((raw / SLIDER_WIDTH) * (steps.length - 1));
        if (idx !== currentIdx.current) {
          currentIdx.current = idx;
          onChange(idx);
        }
      },
    })
  ).current;

  const pct = (value / (steps.length - 1)) * 100;

  return (
    <View style={sliderStyles.wrapper} {...panResponder.panHandlers}>
      <View style={sliderStyles.track}>
        <View style={[sliderStyles.fill, { width: `${pct}%` }]} />
        <View style={[sliderStyles.thumb, { left: `${pct}%` }]} />
      </View>
      <View style={sliderStyles.ticks}>
        {steps.map((s, i) => (
          <Text key={s} style={[sliderStyles.tick, i === value && sliderStyles.tickActive]}>
            {s}
          </Text>
        ))}
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  wrapper: { paddingVertical: 8, marginBottom: 4 },
  track: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 12,
    position: 'relative'
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2
  },
  thumb: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.text,
    marginLeft: -10,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5
  },
  ticks: { flexDirection: 'row', justifyContent: 'space-between' },
  tick: { color: Colors.textMuted, fontSize: 10 },
  tickActive: { color: Colors.primary, fontWeight: '700' },
});

function FiltrosScreen({ onClose, filtros, onAplicar }) {
  const [calificacion, setCalificacion] = useState(filtros.calificacion);
  const [generosSelec, setGenerosSelec] = useState(filtros.generos);
  const [precioIdx, setPrecioIdx] = useState(filtros.precioIdx);
  const [distanciaIdx, setDistanciaIdx] = useState(filtros.distanciaIdx);
  const [abiertoAhora, setAbiertoAhora] = useState(filtros.abiertoAhora);
  const [nocturno, setNocturno] = useState(filtros.nocturno);
  const [finesDeSeamana, setFinesDeSeamana] = useState(filtros.finesDeSeamana);

  const toggleGenero = (g) => {
    setGenerosSelec(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const handleAplicar = () => {
    onAplicar({
      calificacion,
      generos: generosSelec,
      precioIdx,
      distanciaIdx,
      abiertoAhora,
      nocturno,
      finesDeSeamana
    });
    onClose();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={onClose} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>FILTROS</Text>

        <Text style={styles.filtroLabel}>CALIFICACION</Text>
        <View style={styles.estrellasRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <TouchableOpacity key={n} onPress={() => setCalificacion(n)}>
              <Text style={[styles.estrellaFiltro, n <= calificacion && styles.estrellaFiltroActiva]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.separador} />

        <Text style={styles.filtroLabel}>TIPO DE MUSICA</Text>
        <View style={styles.generosGrid}>
          {GENEROS.map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.generoBtn, generosSelec.includes(g) && styles.generoBtnActivo]}
              onPress={() => toggleGenero(g)}
            >
              <Text style={[styles.generoText, generosSelec.includes(g) && styles.generoTextActivo]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.separador} />

        <Text style={styles.filtroLabel}>PRECIO ENTRADA</Text>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>Gratis</Text>
          <Text style={[styles.sliderLabel, { color: Colors.primary }]}>
            {PRECIOS[precioIdx] === 'Gratis' ? 'Gratis' : `Max ${PRECIOS[precioIdx]}`}
          </Text>
        </View>

        <DragSlider value={precioIdx} onChange={setPrecioIdx} steps={PRECIOS} />

        <View style={styles.separador} />

        <Text style={styles.filtroLabel}>DISTANCIA</Text>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>1km</Text>
          <Text style={[styles.sliderLabel, { color: Colors.primary }]}>
            Max {DISTANCIAS[distanciaIdx]}
          </Text>
        </View>

        <DragSlider value={distanciaIdx} onChange={setDistanciaIdx} steps={DISTANCIAS} />

        <View style={styles.separador} />

        <Text style={styles.filtroLabel}>DISPONIBILIDAD</Text>

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Abierto ahora</Text>
            <Text style={styles.switchSub}>Eventos en horario activo</Text>
          </View>
          <Switch
            value={abiertoAhora}
            onValueChange={setAbiertoAhora}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Nocturno</Text>
            <Text style={styles.switchSub}>Shows despues de las 7pm</Text>
          </View>
          <Switch
            value={nocturno}
            onValueChange={setNocturno}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Fines de Semana</Text>
            <Text style={styles.switchSub}>Viernes, sabado y domingo</Text>
          </View>
          <Switch
            value={finesDeSeamana}
            onValueChange={setFinesDeSeamana}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <TouchableOpacity style={styles.aplicarBtn} onPress={handleAplicar}>
          <Text style={styles.aplicarBtnText}>Aplicar filtros</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ToquesScreen() {
  const [lugares, setLugares] = useState([]);
  const [resenias, setResenias] = useState({});
  const [lugarActivo, setLugarActivo] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [opinion, setOpinion] = useState('');
  const [estrellasSeleccionadas, setEstrellasSeleccionadas] = useState(0);
  const [reseniaActiva, setReseniaActiva] = useState(null);
  const [filtrosVisible, setFiltrosVisible] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardandoResenia, setGuardandoResenia] = useState(false);

  const [filtros, setFiltros] = useState({
    calificacion: 0,
    generos: [],
    precioIdx: 0,
    distanciaIdx: 0,
    abiertoAhora: false,
    nocturno: false,
    finesDeSeamana: false,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const [respuestaToques, respuestaResenas] = await Promise.all([
        fetch(`${API_URL}/toques`),
        fetch(`${API_URL}/resenas`)
      ]);

      const dataToques = await respuestaToques.json();
      const dataResenas = await respuestaResenas.json();

      const lugaresBackend = (dataToques.data || []).map((lugar) => ({
        id: lugar._id,
        _id: lugar._id,
        nombre: lugar.nombre,
        imagen: obtenerImagenLugar(lugar.nombre),
        rating: lugar.rating,
        categoria: lugar.categoria,
        direccion: lugar.direccion,
        ciudad: lugar.ciudad,
        lat: lugar.lat,
        lng: lugar.lng,
        generos: lugar.generos || [],
        mapsUrl: lugar.mapsUrl
      }));

      const reseniasAgrupadas = {};

      (dataResenas.data || []).forEach((r, index) => {
        const toqueId = typeof r.toque === 'object' ? r.toque?._id : r.toque;

        if (!toqueId) return;

        if (!reseniasAgrupadas[toqueId]) {
          reseniasAgrupadas[toqueId] = [];
        }

        const badgeNormalizado = normalizarBadge(r.badge, r.usuario);

        reseniasAgrupadas[toqueId].push({
          id: r._id,
          _id: r._id,
          toque: toqueId,
          usuario: r.usuario,
          badge: badgeNormalizado,
          estrellas: r.estrellas,
          texto: r.texto,
          likes: r.likes || 0,
          comentarios: r.comentarios || [],
          imagen: obtenerImagenUsuario(r.usuario, index),
          fecha: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
          hora: r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
        });
      });

      setLugares(lugaresBackend);
      setResenias(reseniasAgrupadas);
    } catch (error) {
      console.log('Error cargando toques:', error);
      Alert.alert('Error', 'No se pudieron cargar los toques.');
    } finally {
      setCargando(false);
    }
  };

  const lugar = lugares.find(l => l.id === lugarActivo);
  const reseniasActuales = resenias[lugarActivo] || [];

  const lugaresFiltrados = lugares.filter(l => {
    const matchBusqueda = l.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchRating = filtros.calificacion === 0 || l.rating >= filtros.calificacion;
    const matchGenero = filtros.generos.length === 0 || l.generos.some(g => filtros.generos.includes(g));
    return matchBusqueda && matchRating && matchGenero;
  });

  const handleAgregarResenia = async () => {
    if (!opinion.trim() || estrellasSeleccionadas === 0) {
      Alert.alert('Campos incompletos', 'Debes escribir una opinión y seleccionar una calificación.');
      return;
    }

    if (!lugarActivo) return;

    try {
      setGuardandoResenia(true);

      const nuevaResenia = {
        toque: lugarActivo,
        usuario: 'SIN VALOR',
        badge: 'Músico',
        estrellas: estrellasSeleccionadas,
        texto: opinion.trim(),
        likes: 0
      };

      const respuesta = await fetch(`${API_URL}/resenas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaResenia)
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        Alert.alert('Error', data.mensaje || 'No se pudo guardar la reseña.');
        return;
      }

      setOpinion('');
      setEstrellasSeleccionadas(0);

      await cargarDatos();

      Alert.alert('Reseña publicada', 'Tu reseña fue guardada correctamente.');
    } catch (error) {
      console.log('Error guardando reseña:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setGuardandoResenia(false);
    }
  };

  if (filtrosVisible) {
    return (
      <FiltrosScreen
        onClose={() => setFiltrosVisible(false)}
        filtros={filtros}
        onAplicar={(f) => setFiltros(f)}
      />
    );
  }

  if (reseniaActiva) {
    return (
      <PostScreen
        reseña={reseniaActiva}
        onBack={() => setReseniaActiva(null)}
      />
    );
  }

  if (lugarActivo && lugar) {
    return (
      <SafeAreaView style={styles.container}>
        <Header onBack={() => setLugarActivo(null)} />

        <ScrollView contentContainerStyle={styles.scroll}>
          <Image source={lugar.imagen} style={styles.lugarImg} />

          <Text style={styles.lugarNombre}>{lugar.nombre}</Text>

          <Text style={styles.lugarRating}>
            {'★'.repeat(Math.round(lugar.rating))} {lugar.rating} · {lugar.direccion}
          </Text>

          <TouchableOpacity style={styles.verMapaBtn} onPress={() => Linking.openURL(lugar.mapsUrl)}>
            <Text style={styles.verMapaText}>Ver en Google Maps</Text>
          </TouchableOpacity>

          <Text style={styles.seccionTitulo}>SHOWS</Text>
          <Text style={styles.muted}>Sin shows programados esta semana</Text>

          <Text style={styles.seccionTitulo}>Descripcion del lugar</Text>

          <View style={styles.infoGrid}>
            {[
              { label: 'Sistema PA', valor: 'Portable' },
              { label: 'Monitores', valor: 'No tiene' },
              { label: 'Tarima', valor: 'Sin tarima' },
              { label: 'Iluminacion', valor: 'Solo barra' },
              { label: 'Camerino', valor: 'No' },
              { label: 'Pago', valor: 'Solo consumo' },
            ].map((item, i) => (
              <View key={i} style={styles.infoBox}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValor}>{item.valor}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.seccionTitulo}>EXPERIENCIAS</Text>
          <Text style={styles.muted}>Tu opinion</Text>

          <TextInput
            style={styles.input}
            placeholder="Escribe tu respuesta..."
            placeholderTextColor={Colors.textMuted}
            value={opinion}
            onChangeText={setOpinion}
            multiline
          />

          <View style={styles.reseniaFooter}>
            <View style={styles.estrellasRow}>
              {[1, 2, 3, 4, 5].map(n => (
                <TouchableOpacity key={n} onPress={() => setEstrellasSeleccionadas(n)}>
                  <Text style={[styles.estrella, n <= estrellasSeleccionadas && styles.estrellaActiva]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.agregarBtn, guardandoResenia && styles.agregarBtnDesactivado]}
              onPress={handleAgregarResenia}
              disabled={guardandoResenia}
            >
              {guardandoResenia ? (
                <ActivityIndicator color={Colors.background} />
              ) : (
                <Text style={styles.agregarBtnText}>Agregar resena</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.seccionTitulo}>RESEÑAS</Text>

          {reseniasActuales.length === 0 && (
            <Text style={styles.muted}>Sin reseñas aun. Se el primero en opinar.</Text>
          )}

          {reseniasActuales.map(r => (
            <TouchableOpacity key={r.id} onPress={() => setReseniaActiva(r)}>
              <View style={styles.reseniaCard}>
                <View style={styles.reseniaHeader}>
                  <Image source={r.imagen} style={styles.avatar} />

                  <View style={{ flex: 1 }}>
                    <View style={styles.reseniaUsuarioRow}>
                      <Text style={styles.reseniaUsuario}>{r.usuario}</Text>

                      <View style={r.badge === 'Oyente' ? styles.badgeOyente : styles.badgeMusico}>
                        <Text style={styles.badgeText}>{r.badge}</Text>
                      </View>
                    </View>

                    <Estrellas cantidad={r.estrellas} />
                  </View>
                </View>

                <Text style={styles.reseniaTexto}>{r.texto}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>MAPA DE TOQUES</Text>
        <Text style={styles.muted}>Toca el mapa para expandirlo</Text>

        {cargando ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.loadingText}>Cargando toques...</Text>
          </View>
        ) : (
          <>
            <MapaVisual
              onPinPress={(id) => setLugarActivo(id)}
              lugaresFiltrados={lugaresFiltrados}
            />

            <Text style={styles.muted}>O revisa los toques cercanos a ti...</Text>
            <Text style={styles.mutedSub}>La aplicacion calcula los toques cercanos a ti de 2km a la redonda</Text>

            <View style={styles.buscadorRow}>
              <View style={styles.buscadorWrap}>
                <TextInput
                  style={styles.buscador}
                  placeholder="Buscar..."
                  placeholderTextColor={Colors.textMuted}
                  value={busqueda}
                  onChangeText={setBusqueda}
                />
              </View>

              <TouchableOpacity style={styles.filtroIconBtn} onPress={() => setFiltrosVisible(true)}>
                <Text style={styles.filtroIconText}>Filtros</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.lugaresHScroll}>
              {lugaresFiltrados.map(l => (
                <TouchableOpacity key={l.id} style={styles.lugarCardH} onPress={() => setLugarActivo(l.id)}>
                  <Image source={l.imagen} style={styles.lugarCardHImg} />
                  <Text style={styles.lugarCardHNombre}>{l.nombre}</Text>
                  <Text style={styles.lugarCardHRating}>{'★'.repeat(Math.round(l.rating))} {l.rating}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.subtitulo}>LUGARES</Text>

            {lugaresFiltrados.map(l => (
              <TouchableOpacity key={l.id} style={styles.lugarCard} onPress={() => setLugarActivo(l.id)}>
                <Image source={l.imagen} style={styles.lugarCardImg} />

                <View style={{ flex: 1 }}>
                  <Text style={styles.lugarCardNombre}>{l.nombre}</Text>
                  <Text style={styles.lugarCardRating}>★ {l.rating} · {l.categoria}</Text>
                  <Text style={styles.lugarCardDir}>{l.direccion}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {lugaresFiltrados.length === 0 && (
              <Text style={styles.muted}>No se encontraron lugares con esos filtros.</Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  titulo: { color: Colors.text, fontSize: 28, fontWeight: '900', marginBottom: 8 },
  subtitulo: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 10 },
  muted: { color: Colors.textMuted, fontSize: 13, marginBottom: 4 },
  mutedSub: { color: Colors.textMuted, fontSize: 12, marginBottom: 14 },

  loadingBox: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  loadingText: { color: Colors.textMuted, fontSize: 13 },

  mapaContainer: { height: 220, borderRadius: 12, overflow: 'hidden', marginBottom: 16, backgroundColor: '#1a1f2e' },
  mapaFondo: { flex: 1, position: 'relative' },
  mapaLineaH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  mapaLineaV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  mapaManzana: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 2 },
  mapaPin: { position: 'absolute', alignItems: 'center' },
  mapaPinDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary, shadowColor: Colors.primary, shadowOpacity: 0.8, shadowRadius: 6, elevation: 6 },
  mapaPinLabel: { backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2, marginTop: 3, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)' },
  mapaPinText: { color: '#fff', fontSize: 8, fontWeight: '700' },
  mapaPinRating: { color: Colors.primary, fontSize: 7 },
  mapaFooterLabel: { position: 'absolute', bottom: 8, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  mapaFooterText: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },

  buscadorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  buscadorWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.input, borderRadius: 10, paddingHorizontal: 12 },
  buscador: { flex: 1, color: Colors.text, paddingVertical: 12, fontSize: 14 },
  filtroIconBtn: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filtroIconText: { color: Colors.text, fontSize: 12, fontWeight: '700' },

  lugaresHScroll: { marginBottom: 16 },
  lugarCardH: { width: 140, backgroundColor: Colors.card, borderRadius: 10, marginRight: 10, overflow: 'hidden' },
  lugarCardHImg: { width: '100%', height: 90 },
  lugarCardHNombre: { color: Colors.text, fontWeight: '700', fontSize: 12, padding: 8, paddingBottom: 2 },
  lugarCardHRating: { color: Colors.primary, fontSize: 11, paddingHorizontal: 8, paddingBottom: 8 },

  lugarCard: { flexDirection: 'row', gap: 12, backgroundColor: Colors.card, borderRadius: 10, padding: 10, marginBottom: 10 },
  lugarCardImg: { width: 70, height: 70, borderRadius: 8 },
  lugarCardNombre: { color: Colors.text, fontWeight: '700', fontSize: 14 },
  lugarCardRating: { color: Colors.primary, fontSize: 12, marginTop: 2 },
  lugarCardDir: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },

  lugarImg: { height: 180, borderRadius: 12, marginBottom: 12, width: '100%' },
  lugarNombre: { color: Colors.text, fontSize: 22, fontWeight: '900', marginBottom: 4 },
  lugarRating: { color: Colors.textMuted, fontSize: 12, marginBottom: 10 },
  verMapaBtn: { backgroundColor: Colors.card, borderRadius: 8, padding: 10, alignSelf: 'flex-start', marginBottom: 12 },
  verMapaText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },

  seccionTitulo: { color: Colors.text, fontSize: 15, fontWeight: '800', marginTop: 16, marginBottom: 8 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  infoBox: { width: '47%', backgroundColor: Colors.card, borderRadius: 8, padding: 10 },
  infoLabel: { color: Colors.textMuted, fontSize: 11, marginBottom: 2 },
  infoValor: { color: Colors.text, fontWeight: '600', fontSize: 13 },

  input: { backgroundColor: Colors.input, color: Colors.text, borderRadius: 8, padding: 12, fontSize: 14, minHeight: 80, textAlignVertical: 'top', marginBottom: 10 },
  reseniaFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  estrellasRow: { flexDirection: 'row', gap: 4 },
  estrella: { fontSize: 24, color: Colors.border },
  estrellaActiva: { color: Colors.primary },
  agregarBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  agregarBtnDesactivado: { backgroundColor: Colors.border },
  agregarBtnText: { color: Colors.background, fontWeight: '800', fontSize: 13 },

  reseniaCard: { backgroundColor: Colors.card, borderRadius: 10, padding: 12, marginBottom: 10 },
  reseniaHeader: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.border },
  reseniaUsuarioRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  reseniaUsuario: { color: Colors.text, fontWeight: '700', fontSize: 13 },

  badgeMusico: {
    backgroundColor: '#F9B233',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  badgeOyente: {
    backgroundColor: '#4A8AF0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  badgeText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '700'
  },

  reseniaTexto: { color: Colors.textMuted, fontSize: 12, lineHeight: 18 },

  filtroLabel: { color: Colors.text, fontWeight: '800', fontSize: 13, marginBottom: 12, letterSpacing: 1 },
  separador: { height: 1, backgroundColor: Colors.border, marginVertical: 20 },
  estrellaFiltro: { fontSize: 32, color: Colors.border, marginRight: 4 },
  estrellaFiltroActiva: { color: '#F9B233' },
  generosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  generoBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  generoBtnActivo: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  generoText: { color: Colors.textMuted, fontSize: 13 },
  generoTextActivo: { color: Colors.background, fontWeight: '700' },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  sliderLabel: { color: Colors.textMuted, fontSize: 12 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  switchLabel: { color: Colors.text, fontWeight: '600', fontSize: 14 },
  switchSub: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  aplicarBtn: { backgroundColor: Colors.primary, borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 24 },
  aplicarBtnText: { color: Colors.background, fontWeight: '900', fontSize: 15 },
});