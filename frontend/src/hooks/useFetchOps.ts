import { useEffect, useState } from 'react';
import type { Op } from '../types/Op';

export const useFetchOps = () => {
  const [ops, setOps] = useState<Op[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/op')
      .then(res => res.json())
      .then(data => {
        console.log('Dados recebidos:', data);
        setOps(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { ops, loading, setOps };
};
