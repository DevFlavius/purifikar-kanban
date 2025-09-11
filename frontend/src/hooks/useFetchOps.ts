import { useEffect, useState } from 'react';
import type { Op } from '../types/Op';

export const useFetchOps = () => {
  const [ops, setOps] = useState<Op[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOps = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/op`);
        if (!response.ok) {
          throw new Error('A resposta da rede não foi boa');
        }
        const data = await response.json();
        setOps(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocorreu um erro desconhecido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOps();
  }, []);

  return { ops, setOps, loading, error };
};