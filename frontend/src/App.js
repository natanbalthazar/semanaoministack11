import React, { useState } from 'react';
import Header from './Header';

function App() {
  const [contador, setContador] = useState(0);

  function increment() {
    setContador(contador + 1);
  }

  function clear() {
    setContador(0);
  }

  return (
    <div>
      <Header>Contador: {contador}</Header>
      <button onClick={increment}>Incrementar</button>
      <button onClick={clear}>Limpar</button>
    </div>
  );
}

export default App;
