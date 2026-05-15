import React from 'react';
import { Modal } from 'react-native';
import { useChat } from '../context/ChatContext';
import ListaChatsScreen from '../screens/ListaChatsScreen';
import ChatScreen from '../screens/ChatScreen';
import PerfilUsuarioScreen from '../screens/PerfilUsuarioScreen';
import BusquedaScreen from '../screens/BusquedaScreen';

export default function ChatModal({ onCerrarSesion = null }) {
  const {
    listaVisible, chatVisible, chatSeleccionado,
    cerrarLista, abrirChat, cerrarChat, volverALista,
    perfilVisible, cerrarPerfil,
    busquedaVisible, cerrarBusqueda,
  } = useChat();

  const handleCerrarSesion = () => {
    cerrarPerfil();
    if (onCerrarSesion) onCerrarSesion();
  };

  return (
    <>
      <Modal visible={listaVisible} animationType="slide">
        <ListaChatsScreen
          onClose={cerrarLista}
          onSelectChat={(chat) => abrirChat(chat)}
        />
      </Modal>

      <Modal visible={chatVisible} animationType="slide">
        <ChatScreen
          artista={chatSeleccionado}
          onClose={cerrarChat}
          onBack={volverALista}
        />
      </Modal>

      <Modal visible={perfilVisible} animationType="slide">
        <PerfilUsuarioScreen
          key={perfilVisible ? 'open' : 'closed'}
          onClose={cerrarPerfil}
          onCerrarSesion={handleCerrarSesion}
        />
      </Modal>

      <Modal visible={busquedaVisible} animationType="slide">
        <BusquedaScreen onClose={cerrarBusqueda} />
      </Modal>
    </>
  );
}