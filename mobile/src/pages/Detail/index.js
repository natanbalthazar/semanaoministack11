import { Alert, Image, Text, View, Linking, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather';
import * as MailComposer from 'expo-mail-composer';

import logoImg from '../../assets/logo.png';
import formatCurrency from '../../utils/formatCurrency';
import { colors } from '../../theme';
import styles from './styles';

export default function Detail() {
  const navigation = useNavigation();
  const route = useRoute();

  // Enviado pela lista em navigation.navigate('Detail', { incident }).
  const { incident } = route.params;
  const value = formatCurrency(incident.value);
  const message = `Olá ${incident.name}, estou entrando em contato pois gostaria de ajudar no caso "${incident.title}" com o valor de ${value}.`;

  function navigateBack() {
    navigation.goBack();
  }

  /**
   * Abre o app de e-mail do aparelho já preenchido; o usuário só confirma o envio.
   * Se não houver conta de e-mail configurada (ex.: simulador iOS) → composeAsync
   * rejeita a Promise; sem o catch, isso virava um erro não tratado.
   */
  async function sendMail() {
    try {
      await MailComposer.composeAsync({
        subject: `Herói do caso: ${incident.title}`,
        recipients: [incident.email],
        body: message,
      });
    } catch {
      Alert.alert('E-mail indisponível', 'Configure uma conta de e-mail neste aparelho para entrar em contato.');
    }
  }

  /**
   * Abre o WhatsApp por deep link (whatsapp://). Dois cuidados:
   * - O texto vai na URL, então precisa de encodeURIComponent: sem ele, um "&" ou "#"
   *   no título do caso cortava a mensagem no meio.
   * - Se o WhatsApp não estiver instalado → openURL rejeita a Promise; avisamos o usuário.
   */
  async function sendWhatsapp() {
    try {
      await Linking.openURL(`whatsapp://send?phone=${incident.whatsapp}&text=${encodeURIComponent(message)}`);
    } catch {
      Alert.alert('WhatsApp indisponível', 'Não foi possível abrir o WhatsApp neste aparelho.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        {/* Botão só com ícone: o accessibilityLabel é o que o leitor de tela anuncia. */}
        <TouchableOpacity onPress={navigateBack} accessibilityRole="button" accessibilityLabel="Voltar">
          <Feather name="arrow-left" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.incident}>
        <Text style={[styles.incidentProperty, styles.firstProperty]}>ONG:</Text>
        <Text style={styles.incidentValue}>{incident.name} de {incident.city}/{incident.uf}</Text>

        <Text style={styles.incidentProperty}>CASO:</Text>
        <Text style={styles.incidentValue}>{incident.title}</Text>

        <Text style={styles.incidentProperty}>VALOR:</Text>
        <Text style={styles.incidentValue}>{value}</Text>
      </View>

      <View style={styles.contactBox}>
        <Text style={styles.heroTitle}>Salve o dia!</Text>
        <Text style={styles.heroTitle}>Seja o herói desse caso.</Text>

        <Text style={styles.heroDescription}>Entre em contato:</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.action} onPress={sendWhatsapp} accessibilityRole="button">
            <Text style={styles.actionText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={sendMail} accessibilityRole="button">
            <Text style={styles.actionText}>E-mail</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
