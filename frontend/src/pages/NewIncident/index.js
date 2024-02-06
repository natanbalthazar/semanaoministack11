import { useState } from 'react';
import './styles.css';
import logoImg from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import api from '../../services/api';

export default function NewIncident() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  const ongId = localStorage.getItem('ongId');

  const navigate = useNavigate();

  async function handleNewIncident(e) {
    e.preventDefault();

    const data = {
      title,
      description,
      value,
    };

    try {
      await api.post('incidents', data, {
        headers: {
          Authorization: ongId,
        }
      })

      navigate('/profile');
    } catch (error) {
      alert('Erro ao cadastrar caso, tente novamente.')
    }
  }


  return (
    <div className="new-incident-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be The Hero" />

          <h1>Cadastrar novo caso</h1>
          <p>Descreva o caso detalhadamente para encontrar um herói para resolver isso.</p>

          <Link className="back-link" to="/profile">
            <FiArrowLeft size={16} color='#E02041' />
            Voltar para home
          </Link>
        </section>
        <form onSubmit={handleNewIncident}>
          <input
            placeholder='Título do caso'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <textarea
            placeholder='Descrição'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <input
            placeholder='Valor em reais'
            title='Caso deseje colocar centavos, use .(ponto) ao invés da ,(vírgula) . Por exemplo, 10.11.'
            value={value}
            onChange={e => setValue(e.target.value)}
          />

          <button className='button' type='submit'> Cadastrar </button>

        </form>
      </div>
    </div>
  )
}