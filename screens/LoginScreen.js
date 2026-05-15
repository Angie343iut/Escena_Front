import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, Image, Animated, Alert, ActivityIndicator
} from 'react-native';
import { Colors } from '../constants/colors';
import { API_URL } from '../api/api';

const logoEscena = require('../assets/logoescena.png');

export default function LoginScreen({ onLogin }) {
  const [rol, setRol] = useState(null);
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  const opacidadOyente = useRef(new Animated.Value(1)).current;
  const opacidadMusico = useRef(new Animated.Value(1)).current;
  const translateOyente = useRef(new Animated.Value(0)).current;
  const translateMusico = useRef(new Animated.Value(0)).current;

  const seleccionarRol = (rolElegido) => {
    setRol(rolElegido);

    if (rolElegido === 'oyente') {
      Animated.parallel([
        Animated.timing(opacidadMusico, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(translateOyente, { toValue: 80, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacidadOyente, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(translateMusico, { toValue: -80, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  };

  const cambiarRol = () => {
    setRol(null);
    Animated.parallel([
      Animated.timing(opacidadOyente, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(opacidadMusico, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(translateOyente, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(translateMusico, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const iniciarSesion = async () => {
    if (!rol) {
      Alert.alert('Selecciona un rol', 'Debes seleccionar si eres oyente o músico.');
      return;
    }

    if (!correo.trim() || !contrasena.trim()) {
      Alert.alert('Campos incompletos', 'Debes escribir correo y contraseña.');
      return;
    }

    try {
      setCargando(true);

      const respuesta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo: correo.trim().toLowerCase(),
          contrasena: contrasena.trim()
        })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        Alert.alert('Error al iniciar sesión', data.mensaje || 'No se pudo iniciar sesión.');
        return;
      }

      if (data.data?.rol !== rol) {
        Alert.alert(
          'Rol incorrecto',
          `Este usuario está registrado como ${data.data?.rol}. Selecciona el rol correcto.`
        );
        return;
      }

      onLogin(data.data, data.token);
    } catch (error) {
      console.log('Error de login:', error);
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>

        <Image source={logoEscena} style={styles.logo} resizeMode="contain" />
        <Text style={styles.titulo}>Inicia Sesión</Text>

        <View style={styles.rolContainer}>
          <Animated.View style={{ opacity: opacidadOyente, transform: [{ translateX: translateOyente }] }}>
            <TouchableOpacity
              style={[styles.rolBtn, rol === 'oyente' && styles.rolActivoOyente]}
              onPress={() => !rol && seleccionarRol('oyente')}
            >
              <Text style={[styles.rolText, rol === 'oyente' && styles.rolTextoActivo]}>OYENTE</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ opacity: opacidadMusico, transform: [{ translateX: translateMusico }] }}>
            <TouchableOpacity
              style={[styles.rolBtn, rol === 'musico' && styles.rolActivoMusico]}
              onPress={() => !rol && seleccionarRol('musico')}
            >
              <Text style={[styles.rolText, rol === 'musico' && styles.rolTextoActivo]}>MÚSICO</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {rol && (
          <TouchableOpacity onPress={cambiarRol} style={styles.cambiarRolBtn}>
            <Text style={styles.cambiarRolText}>← Cambiar rol</Text>
          </TouchableOpacity>
        )}

        <TextInput
          style={styles.input}
          placeholder="Correo"
          placeholderTextColor={Colors.textMuted}
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={Colors.textMuted}
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.boton, (!rol || cargando) && styles.botonDesactivado]}
          onPress={iniciarSesion}
          disabled={!rol || cargando}
        >
          {cargando ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={styles.botonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  logo: { width: '100%', height: 100, marginBottom: 32 },
  titulo: { color: Colors.text, fontSize: 20, fontWeight: '600', marginBottom: 16 },
  rolContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rolBtn: {
    width: 130,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rolActivoOyente: { backgroundColor: '#4FC3F7' },
  rolActivoMusico: { backgroundColor: '#F9A825' },
  rolText: { color: Colors.textMuted, fontWeight: '800', fontSize: 13 },
  rolTextoActivo: { color: Colors.background },
  cambiarRolBtn: { alignSelf: 'center', marginBottom: 16, padding: 8 },
  cambiarRolText: { color: Colors.textMuted, fontSize: 13 },
  input: {
    backgroundColor: Colors.input,
    color: Colors.text,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 14,
  },
  boton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  botonDesactivado: { backgroundColor: Colors.border },
  botonText: { color: Colors.background, fontWeight: '800', fontSize: 16 },
});