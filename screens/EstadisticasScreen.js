import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Colors } from '../constants/colors';
import Header from '../components/Header';
import { API_URL } from '../api/api';

const periodos = ['7 días', '30 días', '3 meses', '1 año'];

const datosBasePorPeriodo = {
  '7 días': {
    reproducciones: '1.0K',
    maxDiario: '210',
    seguidores: '+180',
    oyentes: [60, 45, 70, 75, 65, 90, 100],
    ciudades: [
      { nombre: 'Bogotá', pct: 48 },
      { nombre: 'Medellín', pct: 22 },
      { nombre: 'Cali', pct: 14 },
      { nombre: 'Barranquilla', pct: 9 },
      { nombre: 'Otros', pct: 7 },
    ],
    nuevosSeguidores: '+180',
  },
  '30 días': {
    reproducciones: '4.2K',
    maxDiario: '380',
    seguidores: '+520',
    oyentes: [40, 55, 60, 80, 90, 75, 110],
    ciudades: [
      { nombre: 'Bogotá', pct: 45 },
      { nombre: 'Medellín', pct: 25 },
      { nombre: 'Cali', pct: 16 },
      { nombre: 'Barranquilla', pct: 8 },
      { nombre: 'Otros', pct: 6 },
    ],
    nuevosSeguidores: '+520',
  },
  '3 meses': {
    reproducciones: '12.8K',
    maxDiario: '620',
    seguidores: '+1.2K',
    oyentes: [70, 85, 90, 100, 95, 120, 140],
    ciudades: [
      { nombre: 'Bogotá', pct: 42 },
      { nombre: 'Medellín', pct: 28 },
      { nombre: 'Cali', pct: 15 },
      { nombre: 'Barranquilla', pct: 10 },
      { nombre: 'Otros', pct: 5 },
    ],
    nuevosSeguidores: '+1.2K',
  },
  '1 año': {
    reproducciones: '48.5K',
    maxDiario: '980',
    seguidores: '+4.8K',
    oyentes: [50, 70, 90, 110, 100, 130, 160],
    ciudades: [
      { nombre: 'Bogotá', pct: 40 },
      { nombre: 'Medellín', pct: 30 },
      { nombre: 'Cali', pct: 16 },
      { nombre: 'Barranquilla', pct: 9 },
      { nombre: 'Otros', pct: 5 },
    ],
    nuevosSeguidores: '+4.8K',
  },
};

const topCancionesFallback = {
  '7 días': [
    { pos: 1, titulo: 'Marchito', streams: '8,420', cambio: '+12%', positivo: true },
    { pos: 2, titulo: 'N.N', streams: '6,312', cambio: '+8%', positivo: true },
    { pos: 3, titulo: 'Carroña', streams: '5,324', cambio: '+21%', positivo: true },
    { pos: 4, titulo: 'Mala conducta', streams: '3,564', cambio: '-3%', positivo: false },
    { pos: 5, titulo: '(Intro)', streams: '1,543', cambio: '+5%', positivo: true },
  ],
  '30 días': [
    { pos: 1, titulo: 'Marchito', streams: '32,100', cambio: '+18%', positivo: true },
    { pos: 2, titulo: 'Carroña', streams: '21,400', cambio: '+25%', positivo: true },
    { pos: 3, titulo: 'N.N', streams: '18,200', cambio: '+10%', positivo: true },
    { pos: 4, titulo: '(Intro)', streams: '9,800', cambio: '-1%', positivo: false },
    { pos: 5, titulo: 'Mala conducta', streams: '7,200', cambio: '+3%', positivo: true },
  ],
  '3 meses': [
    { pos: 1, titulo: 'Carroña', streams: '98,400', cambio: '+32%', positivo: true },
    { pos: 2, titulo: 'Marchito', streams: '87,200', cambio: '+22%', positivo: true },
    { pos: 3, titulo: 'N.N', streams: '54,100', cambio: '+15%', positivo: true },
    { pos: 4, titulo: 'Mala conducta', streams: '32,800', cambio: '-5%', positivo: false },
    { pos: 5, titulo: '(Intro)', streams: '21,000', cambio: '+8%', positivo: true },
  ],
  '1 año': [
    { pos: 1, titulo: 'Carroña', streams: '320,000', cambio: '+45%', positivo: true },
    { pos: 2, titulo: 'Marchito', streams: '280,400', cambio: '+38%', positivo: true },
    { pos: 3, titulo: 'N.N', streams: '190,200', cambio: '+28%', positivo: true },
    { pos: 4, titulo: 'Mala conducta', streams: '110,800', cambio: '+12%', positivo: true },
    { pos: 5, titulo: '(Intro)', streams: '85,000', cambio: '-2%', positivo: false },
  ],
};

const dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const multiplicadorPorPeriodo = {
  '7 días': 1,
  '30 días': 4,
  '3 meses': 12,
  '1 año': 48,
};

const cambiosDemo = ['+18%', '+12%', '+9%', '+5%', '-2%'];

const formatearNumero = (numero) => {
  return Number(numero || 0).toLocaleString('es-CO');
};

const generarTopCanciones = (canciones, periodo) => {
  if (!canciones || canciones.length === 0) {
    return topCancionesFallback[periodo];
  }

  const multiplicador = multiplicadorPorPeriodo[periodo] || 1;

  return canciones.slice(0, 5).map((cancion, index) => {
    const base = 1800 - index * 260;
    const streams = Math.max(500, base * multiplicador + canciones.length * 120);

    return {
      pos: index + 1,
      titulo: cancion.titulo || `Canción ${index + 1}`,
      streams: formatearNumero(streams),
      cambio: cambiosDemo[index] || '+3%',
      positivo: !(cambiosDemo[index] || '').includes('-'),
    };
  });
};

const generarResumen = (cantidadCanciones, periodo) => {
  const multiplicador = multiplicadorPorPeriodo[periodo] || 1;
  const reproducciones = Math.max(1000, cantidadCanciones * 850 * multiplicador);
  const maxDiario = Math.max(210, cantidadCanciones * 35 * multiplicador);
  const seguidores = Math.max(180, cantidadCanciones * 45 * multiplicador);

  const formatoK = (n) => {
    if (n >= 1000) {
      return `${(n / 1000).toFixed(n >= 10000 ? 1 : 1)}K`;
    }

    return String(n);
  };

  return {
    reproducciones: formatoK(reproducciones),
    maxDiario: formatearNumero(maxDiario),
    seguidores: `+${formatoK(seguidores)}`,
    nuevosSeguidores: `+${formatoK(seguidores)}`,
  };
};

export default function EstadisticasScreen({ onClose }) {
  const [periodoActivo, setPeriodoActivo] = useState('7 días');
  const [cancionesSinValor, setCancionesSinValor] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarCanciones();
  }, []);

  const cargarCanciones = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch(`${API_URL}/canciones`);
      const data = await respuesta.json();

      const canciones = (data.data || []).filter((cancion) => {
        const artista = cancion.artista?.toLowerCase() || '';
        return artista.includes('sin valor');
      });

      setCancionesSinValor(canciones);
    } catch (error) {
      console.log('Error cargando estadísticas:', error);
      setCancionesSinValor([]);
    } finally {
      setCargando(false);
    }
  };

  const datosBase = datosBasePorPeriodo[periodoActivo];
  const resumenBackend = cancionesSinValor.length > 0
    ? generarResumen(cancionesSinValor.length, periodoActivo)
    : null;

  const datos = {
    ...datosBase,
    ...(resumenBackend || {}),
    topCanciones: generarTopCanciones(cancionesSinValor, periodoActivo),
  };

  const maxOyente = Math.max(...datos.oyentes);

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={onClose} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>ESTADÍSTICAS</Text>

        {cargando && (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.loadingText}>Cargando estadísticas...</Text>
          </View>
        )}

        <View style={styles.periodosRow}>
          {periodos.map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.periodoBtn, periodoActivo === p && styles.periodoBtnActivo]}
              onPress={() => setPeriodoActivo(p)}
            >
              <Text style={[styles.periodoText, periodoActivo === p && styles.periodoTextActivo]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValor}>{datos.reproducciones}</Text>
            <Text style={styles.statLabel}>Reproducciones</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statValor}>{datos.maxDiario}</Text>
            <Text style={styles.statLabel}>Máx diario</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statValor}>{datos.seguidores}</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
        </View>

        <View style={styles.seccionCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.seccionTitulo}>OYENTES</Text>
              <Text style={styles.seccionSub}>Reproducciones en los últimos {periodoActivo}</Text>
            </View>

            <Text style={styles.cardChip}>SIN VALOR</Text>
          </View>

          <View style={styles.barras}>
            {datos.oyentes.map((v, i) => (
              <View key={i} style={styles.barraCol}>
                <View style={[styles.barra, { height: (v / maxOyente) * 100 }]} />
                <Text style={styles.barraLabel}>{dias[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.seccionCard}>
          <Text style={styles.seccionTitulo}>TOP CANCIONES</Text>
          <Text style={styles.seccionSub}>
            {cancionesSinValor.length > 0
              ? `Basado en ${cancionesSinValor.length} canciones publicadas por SIN VALOR`
              : `Reproducciones en los últimos ${periodoActivo}`}
          </Text>

          {datos.topCanciones.map(c => (
            <View key={`${c.pos}-${c.titulo}`} style={styles.cancionRow}>
              <Text style={styles.cancionPos}>{c.pos}</Text>

              <View style={{ flex: 1 }}>
                <Text style={styles.cancionTitulo}>{c.titulo}</Text>
                <Text style={styles.cancionStreams}>{c.streams} streams</Text>
              </View>

              <Text style={[styles.cancionCambio, { color: c.positivo ? Colors.primary : '#FF3B30' }]}>
                {c.cambio}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.seccionCard}>
          <Text style={styles.seccionTitulo}>TOP CIUDADES</Text>
          <Text style={styles.seccionSub}>Audiencia principal estimada</Text>

          {datos.ciudades.map(c => (
            <View key={c.nombre} style={styles.ciudadRow}>
              <Text style={styles.ciudadNombre}>{c.nombre}</Text>

              <View style={styles.ciudadBarraFondo}>
                <View style={[styles.ciudadBarraFill, { width: `${c.pct}%` }]} />
              </View>

              <Text style={styles.ciudadPct}>{c.pct}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.seccionCard}>
          <Text style={styles.seccionTitulo}>NUEVOS SEGUIDORES</Text>
          <Text style={styles.seguidoresValor}>{datos.nuevosSeguidores}</Text>
          <Text style={styles.seccionSub}>En los últimos {periodoActivo}</Text>
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
    marginBottom: 20
  },

  loadingBox: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13
  },

  periodosRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20
  },
  periodoBtn: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center'
  },
  periodoBtnActivo: {
    backgroundColor: Colors.primary
  },
  periodoText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600'
  },
  periodoTextActivo: {
    color: Colors.background,
    fontWeight: '800'
  },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center'
  },
  statBox: {
    flex: 1,
    alignItems: 'center'
  },
  statValor: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '900'
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 4
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border
  },

  seccionCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12
  },
  cardChip: {
    backgroundColor: '#F9B233',
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden'
  },
  seccionTitulo: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4
  },
  seccionSub: {
    color: Colors.textMuted,
    fontSize: 11,
    marginBottom: 16
  },

  barras: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 6
  },
  barraCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  barra: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
    minHeight: 8
  },
  barraLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 6
  },

  cancionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  cancionPos: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
    width: 20
  },
  cancionTitulo: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 14
  },
  cancionStreams: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2
  },
  cancionCambio: {
    fontSize: 13,
    fontWeight: '700'
  },

  ciudadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12
  },
  ciudadNombre: {
    color: Colors.text,
    fontSize: 13,
    width: 90
  },
  ciudadBarraFondo: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3
  },
  ciudadBarraFill: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3
  },
  ciudadPct: {
    color: Colors.textMuted,
    fontSize: 12,
    width: 35,
    textAlign: 'right'
  },

  seguidoresValor: {
    color: Colors.primary,
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 4
  },
});