export const signIn = async (idToken: string) => {
    try {
      // Aqui você pode fazer uma requisição para o seu backend
      // para enviar o token de autenticação do Google e realizar a autenticação do usuário.
      // Exemplo de requisição com fetch:
      const response = await fetch('https://seu-backend.com/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });
  
      // Verifique a resposta do backend e tome as ações apropriadas de acordo com a autenticação bem-sucedida ou falha.
      if (response.ok) {
        // Autenticação bem-sucedida
        console.log('Usuário autenticado com sucesso!');
        // Execute as ações necessárias, como redirecionar para a tela principal do aplicativo.
      } else {
        // Autenticação falhou
        console.log('Falha na autenticação do usuário.');
        // Exiba uma mensagem de erro ou tome outras ações adequadas.
      }
    } catch (error) {
      console.log('Erro ao autenticar o usuário:', error);
      // Trate os erros de acordo com as necessidades do seu aplicativo.
    }
  };
  