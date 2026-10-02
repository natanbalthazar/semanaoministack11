import { useEffect, useRef, useState } from 'react';
import { Image, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather';

import logoImg from '../../assets/logo.png';
import api from '../../services/api';
import formatCurrency from '../../utils/formatCurrency';
import { colors } from '../../theme';
import styles from './styles';

export default function Incidents() {
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);

  // Controle da paginação num ref (e não em state) porque o valor precisa estar
  // atualizado NA HORA: o onEndReached pode disparar várias vezes seguidas antes
  // do próximo render. Com state, as duas chamadas veriam `loading = false` e a
  // mesma página seria pedida (e exibida) duas vezes.
  const pagination = useRef({ page: 1, loaded: 0, hasMore: true, loading: false });

  function navigateToDetail(incident) {
    // O objeto vai como parâmetro da rota e é lido no Detail com useRoute().params.
    navigation.navigate('Detail', { incident });
  }

  async function loadIncidents() {
    const state = pagination.current;

    // Já existe uma requisição em andamento, ou não há mais casos → não faz nada.
    if (state.loading || !state.hasMore) {
      return;
    }

    state.loading = true;
    setError(false);

    try {
      const response = await api.get('incidents', { params: { page: state.page } });

      // A API manda o total de casos no cabeçalho X-Total-Count (o corpo só traz a página).
      // Cabeçalhos chegam como texto: sem o Number(), "12" === 12 seria false e a lista
      // nunca saberia que acabou. No web, o cabeçalho só aparece se o backend o liberar
      // no CORS (exposedHeaders); sem ele, o total fica 0 e quem encerra é a página vazia.
      const totalCount = Number(response.headers['x-total-count']) || 0;

      state.loaded += response.data.length;
      state.hasMore = response.data.length > 0 && (totalCount === 0 || state.loaded < totalCount);
      state.page += 1;

      setIncidents(previous => [...previous, ...response.data]);
      setTotal(totalCount);
    } catch {
      // Sem o try/catch, um erro de rede deixava `loading` preso em true e a lista
      // nunca mais carregava. Aqui liberamos para tentar de novo.
      setError(true);
    } finally {
      state.loading = false;
    }
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}>
          Total de <Text style={styles.headerTextBold}>{total} casos</Text>.
        </Text>
      </View>

      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>

      {/*
        Rolagem infinita: quando faltar 20% da altura da lista para o fim
        (onEndReachedThreshold = 0.2), o FlatList chama onEndReached e buscamos a
        próxima página. Não use um ScrollView com .map() aqui: ele renderiza todos
        os itens de uma vez, enquanto o FlatList só monta os que estão perto da tela.
      */}
      <FlatList
        data={incidents}
        style={styles.incidentList}
        keyExtractor={incident => String(incident.id)}
        showsVerticalScrollIndicator={false}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.2}
        ListFooterComponent={error ? (
          <TouchableOpacity onPress={loadIncidents} accessibilityRole="button">
            <Text style={styles.errorText}>
              Não foi possível carregar os casos. Toque para tentar de novo.
            </Text>
          </TouchableOpacity>
        ) : null}
        renderItem={({ item: incident }) => (
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>ONG:</Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>

            <Text style={styles.incidentProperty}>CASO:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>

            <Text style={styles.incidentProperty}>VALOR:</Text>
            <Text style={styles.incidentValue}>{formatCurrency(incident.value)}</Text>

            <TouchableOpacity style={styles.detailsButton} onPress={() => navigateToDetail(incident)}>
              <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
