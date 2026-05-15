import React, { createContext, useContext, useState } from 'react';

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [listaVisible, setListaVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatSeleccionado, setChatSeleccionado] = useState(null);
  const [perfilVisible, setPerfilVisible] = useState(false);
  const [busquedaVisible, setBusquedaVisible] = useState(false);

  const abrirLista = () => {
    setPerfilVisible(false);
    setBusquedaVisible(false);
    setListaVisible(true);
  };

  const cerrarLista = () => setListaVisible(false);

  const abrirChat = (artista) => {
    setChatSeleccionado(artista);
    setListaVisible(false);
    setPerfilVisible(false);
    setBusquedaVisible(false);
    setChatVisible(true);
  };

  const cerrarChat = () => {
    setChatVisible(false);
    setChatSeleccionado(null);
  };

  const volverALista = () => {
    setChatVisible(false);
    setListaVisible(true);
  };

  const abrirPerfil = () => {
    setListaVisible(false);
    setChatVisible(false);
    setBusquedaVisible(false);
    setPerfilVisible(true);
  };

  const cerrarPerfil = () => setPerfilVisible(false);

  const abrirBusqueda = () => {
    setListaVisible(false);
    setChatVisible(false);
    setPerfilVisible(false);
    setBusquedaVisible(true);
  };

  const cerrarBusqueda = () => setBusquedaVisible(false);

  return (
    <ChatContext.Provider value={{
      listaVisible, chatVisible, chatSeleccionado,
      abrirLista, cerrarLista, abrirChat, cerrarChat, volverALista,
      perfilVisible, abrirPerfil, cerrarPerfil,
      busquedaVisible, abrirBusqueda, cerrarBusqueda,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);