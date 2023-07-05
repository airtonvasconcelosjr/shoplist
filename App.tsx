import React, { useState } from 'react';
import LoginScreen, { LoginScreenProps } from './LoginScreen';
import ShoppingListScreen from './ShoppingListScreen';

interface AppProps {}

export default function App({}: AppProps) {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // Lógica para autenticação do usuário
    // Se a autenticação for bem-sucedida, atualize o estado para "loggedIn"
    // Simulação de autenticação bem-sucedida
    setLoggedIn(true);
  };

  return (
    <>
      {loggedIn ? (
        <ShoppingListScreen />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </>
  );
}
