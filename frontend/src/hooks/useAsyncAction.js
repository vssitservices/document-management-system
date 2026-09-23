import { useCallback, useState } from 'react';

// Encapsula o padrão loading/erro compartilhado por ações assíncronas da UI.
export function useAsyncAction(action, mensagemErro) {
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true);
      setErro(null);
      try {
        return await action(...args);
      } catch (error) {
        setErro(mensagemErro);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [action, mensagemErro]
  );

  return { execute, isLoading, erro };
}
