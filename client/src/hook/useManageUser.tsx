import { useState } from 'react';
import { useUser } from '../context/userContext';
import { SubmitMessageStatus, useSubmitMessage } from './useMessage';
import { createUser, login } from '../services/userServices';
import { AxiosError } from 'axios';

interface handleCreateUser {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function useManageUser() {
  const { setUser } = useUser();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<SubmitMessageStatus>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;

  const Feedback = useSubmitMessage({
    successMessage: successMessage,
    errorMessage: errorMessage,
    type: status,
    displayTime: 2000,
  });

  const verify = (
    password: string,
    confirmPassword?: string,
    username?: string,
  ) => {
    const validations = [
      {
        condition:
          confirmPassword !== undefined && password !== confirmPassword,
        message: 'As senhas não coincidem',
      },
      {
        condition: password.length < 6,
        message: 'A senha deve ter no mínimo 6 caracteres',
      },
      {
        condition: password.length > 20,
        message: 'A senha deve ter no máximo 20 caracteres',
      },
      {
        condition: username !== undefined && username.length < 3,
        message: 'O nome de usuário deve ter no mínimo 3 caracteres',
      },
      {
        condition: username !== undefined && username.length > 20,
        message: 'O nome de usuário deve ter no máximo 20 caracteres',
      },
      // {
      //   condition: !emailRegex.test(email),
      //   message: 'O email é inválido',
      // },
    ];

    for (const { condition, message } of validations) {
      if (condition) {
        return { error: true, message };
      }
    }

    return { error: false, message: '' };
  };

  const handleError = (error: unknown) => {
    setStatus(null);
    if (error instanceof AxiosError) {
      if (error.message === 'Network Error') {
        setErrorMessage('Erro de conexão. Verifique sua internet.');
      } else if (error.response) {
        setErrorMessage(error.response.data.message);
      }
    } else if (error instanceof Error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('Erro ao fazer login');
    }
    console.error(error);
    setTimeout(() => setStatus('error'), 0);
  };

  const onLogin = async (email: string, password: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setStatus(null);
    try {
      const verifyFields = verify(password, email);
      if (verifyFields.error) {
        setErrorMessage(verifyFields.message);
        setTimeout(() => setStatus('error'), 0);
        throw new Error(verifyFields.message);
      }
      const response = await login({ email, password });
      if (!response.success || !response.data) {
        setErrorMessage(response.message || 'Erro ao fazer login');
        setTimeout(() => setStatus('error'), 0);
        throw new Error(response.message || 'Erro ao fazer login');
      }
      setUser(response.data);
      setSuccessMessage('Login realizado com sucesso!');
      setTimeout(() => setStatus('success'), 0);
    } catch (error: unknown) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCreateUser = async ({
    username,
    email,
    password,
    confirmPassword,
  }: handleCreateUser) => {
    if (isLoading) return;
    setIsLoading(true);
    setStatus(null);
    try {
      const verifyFields = verify(password, confirmPassword, username);
      if (verifyFields.error) {
        setErrorMessage(verifyFields.message);
        setTimeout(() => setStatus('error'), 0);
        throw new Error(verifyFields.message);
      }

      const response = await createUser({
        name: username,
        email,
        password,
        confirmPassword,
      });
      if (!response.success || !response.data) {
        setErrorMessage(response.message || 'Erro ao criar usuário');
        setTimeout(() => setStatus('error'), 0);
        throw new Error(response.message || 'Erro ao criar usuário');
      }
      setUser(response.data);
      setSuccessMessage('Usuário criado com sucesso!');
      setTimeout(() => setStatus('success'), 0);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    Feedback,
    onLogin,
    onCreateUser,
    isLoading,
  };
}
