import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { ChatContext } from '../context/ChatContext';

const logoEscena = require('../assets/logoescena.png');

export default function Header({ onBack, onBuscar }) {
  const chatContext = React.useContext(ChatContext);
  const abrirLista = chatContext?.abrirLista || null;
  const abrirPerfil = chatContext?.abrirPerfil || null;
  const abrirBusqueda = chatContext?.abrirBusqueda || onBuscar || null;

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </TouchableOpacity>
        )}
        <Image source={logoEscena} style={styles.logoImg} resizeMode="contain" />
      </View>
      <View style={styles.icons}>
        <TouchableOpacity onPress={abrirBusqueda}>
          <Ionicons name="search-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={abrirLista}>
          <Ionicons name="chatbubble-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={abrirPerfil}>
          <Ionicons name="person-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { marginRight: 4 },
  logoImg: { width: 120, height: 32 },
  icons: { flexDirection: 'row', gap: 16 },
});