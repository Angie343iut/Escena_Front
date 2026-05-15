import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Image,
  StyleSheet, SafeAreaView, StatusBar
} from 'react-native';
import { Audio } from 'expo-av';
import { Colors } from '../constants/colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function ReproductorScreen({ cancion, canciones = [], indice = 0, onClose }) {
  const soundRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [cancionActual, setCancionActual] = useState(cancion);
  const [indiceActual, setIndiceActual] = useState(indice);
  const barWidthRef = useRef(300);

  useEffect(() => {
    cargarAudio(cancionActual);
    return () => { soundRef.current?.unloadAsync(); };
  }, [cancionActual]);

  const cargarAudio = async (c) => {
    try {
      if (soundRef.current) await soundRef.current.unloadAsync();
      if (!c?.audio) return;
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync(
        c.audio,
        { shouldPlay: false },
        (status) => {
          if (status.isLoaded) {
            const dur = status.durationMillis;
            if (dur && isFinite(dur) && dur > 0) setDuration(dur);
            const pos = status.positionMillis;
            if (pos != null && isFinite(pos)) setPosition(pos);
            if (status.didJustFinish) { setPlaying(false); setPosition(0); siguienteCancion(); }
          }
        }
      );
      soundRef.current = sound;
      setPosition(0);
      setDuration(0);
      setPlaying(false);
    } catch (e) {
      console.log('Error cargando audio:', e);
    }
  };

  const siguienteCancion = () => {
    if (!canciones.length) return;
    const nuevoIndice = (indiceActual + 1) % canciones.length;
    setIndiceActual(nuevoIndice);
    setCancionActual(canciones[nuevoIndice]);
  };

  const anteriorCancion = () => {
    if (!canciones.length) return;
    const nuevoIndice = (indiceActual - 1 + canciones.length) % canciones.length;
    setIndiceActual(nuevoIndice);
    setCancionActual(canciones[nuevoIndice]);
  };

  const togglePlay = async () => {
    if (!soundRef.current) return;
    if (playing) { await soundRef.current.pauseAsync(); setPlaying(false); }
    else { await soundRef.current.playAsync(); setPlaying(true); }
  };

  const handleBarPress = async (e) => {
    if (!soundRef.current || !duration || !isFinite(duration)) return;
    const x = e.nativeEvent?.locationX;
    if (x == null || !isFinite(x)) return;
    const w = barWidthRef.current;
    if (!w || w <= 0) return;
    const ratio = Math.max(0, Math.min(x / w, 1));
    const newPos = Math.round(ratio * duration);
    if (!isFinite(newPos) || newPos < 0) return;
    setPosition(newPos);
    try { await soundRef.current.setPositionAsync(newPos); } catch (err) { console.warn('seek error:', err); }
  };

  const saltar = async (segundos) => {
    if (!soundRef.current || !isFinite(duration)) return;
    const newPos = Math.max(0, Math.min(duration, position + segundos * 1000));
    setPosition(newPos);
    try { await soundRef.current.setPositionAsync(newPos); } catch (e) { console.log('Error saltar:', e); }
  };

  const formatTime = (ms) => {
    if (!ms || ms <= 0) return '0:00';
    const totalSeg = Math.floor(ms / 1000);
    const min = Math.floor(totalSeg / 60);
    const seg = totalSeg % 60;
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
  };

  const progreso = duration > 0 ? position / duration : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeIcon}>{'❯'}</Text>
        </TouchableOpacity>
        <Text style={styles.reproduciendo}>Reproduciendo</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.coverContainer}>
        {cancionActual?.imagen ? (
          <Image source={cancionActual.imagen} style={styles.cover} resizeMode="contain" />
        ) : (
          <View style={styles.cover}>
            <Text style={styles.coverArtista}>{cancionActual?.artista || 'SIN VALOR'}</Text>
            <Text style={styles.coverTitulo}>{cancionActual?.titulo || 'MARCHITO'}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.titulo}>{cancionActual?.titulo?.toUpperCase() || 'MARCHITO'}</Text>
        <Text style={styles.artista}>{cancionActual?.artista || 'SIN VALOR'}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={styles.progressBar}
          onLayout={(e) => { barWidthRef.current = e.nativeEvent.layout.width; }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={(e) => handleBarPress(e)}
          onResponderMove={(e) => handleBarPress(e)}
        >
          <View style={styles.progressTrack} />
          <View style={[styles.progressFill, { width: `${progreso * 100}%` }]} />
          <View style={[styles.progressDot, { left: `${progreso * 100}%` }]} />
        </View>
        <View style={styles.tiempos}>
          <Text style={styles.tiempo}>{formatTime(position)}</Text>
          <Text style={styles.tiempo}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controles}>
        <TouchableOpacity onPress={() => saltar(-10)}>
          <MaterialIcons name="replay-10" size={24} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={anteriorCancion}>
          <Ionicons name="play-skip-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
          <Text style={styles.playIcon}>{playing ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={siguienteCancion}>
          <Ionicons name="play-skip-forward" size={24} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => saltar(10)}>
          <MaterialIcons name="forward-10" size={28} color={Colors.text} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 28 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, marginBottom: 8 },
  closeBtn: { width: 60, height: 60, justifyContent: 'center', alignItems: 'center' },
  closeIcon: { color: Colors.text, fontSize: 18, fontWeight: '900', transform: [{ rotate: '90deg' }] },
  reproduciendo: { color: Colors.textMuted, fontSize: 14, textAlign: 'left', marginLeft: -20 },
  coverContainer: { alignItems: 'center', marginBottom: 12 },
  cover: {
    width: '100%', height: 360, backgroundColor: '#111', borderRadius: 12,
    overflow: 'hidden', borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  coverArtista: { color: Colors.text, fontSize: 26, fontWeight: '900', fontStyle: 'italic', marginBottom: 8 },
  coverTitulo: { color: Colors.textMuted, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase' },
  infoContainer: { alignItems: 'center', marginBottom: 12 },
  titulo: { color: Colors.text, fontSize: 20, fontWeight: '900', letterSpacing: 3, marginBottom: 4 },
  artista: { color: Colors.textMuted, fontSize: 13 },
  progressContainer: { marginBottom: 16, paddingHorizontal: 20 },
  progressBar: { height: 20, justifyContent: 'center', marginBottom: 8, position: 'relative' },
  progressTrack: { position: 'absolute', left: 0, right: 0, height: 3, backgroundColor: Colors.border, borderRadius: 2 },
  progressFill: { position: 'absolute', left: 0, height: 3, backgroundColor: Colors.primary, borderRadius: 2 },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary, marginLeft: -5, position: 'absolute', top: 5 },
  tiempos: { flexDirection: 'row', justifyContent: 'space-between' },
  tiempo: { color: Colors.textMuted, fontSize: 12 },
  controles: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28 },
  playBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.text, justifyContent: 'center', alignItems: 'center' },
  playIcon: { color: Colors.background, fontSize: 28 },
});