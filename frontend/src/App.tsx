import { useEffect, useState } from 'react';

function App() {
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/')
      .then(res => res.text())
      .then(data => setMensagem(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Painel de Produção</h1>
      <p>{mensagem}</p>
    </div>
  );
}

export default App;
