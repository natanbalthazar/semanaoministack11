import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Logon from './pages/Logon';
import Register from './pages/Register/index';

export default function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={Logon} />
        <Route path='/register' Component={Register} />
      </Routes>
    </BrowserRouter>
  )
}