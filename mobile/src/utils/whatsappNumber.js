/**
 * Converte o WhatsApp salvo pela ONG no formato internacional que o link do WhatsApp exige.
 *
 * O backend guarda só DDD + número (10 ou 11 dígitos, sem código do país), mas o
 * https://wa.me/<número> precisa do número completo: sem o "55" do Brasil, o WhatsApp
 * procura um número em outro país (ou diz que ele não existe).
 *
 * Passos:
 * 1. Tira tudo que não é dígito: "(11) 98765-4321" → "11987654321".
 * 2. Com 10 ou 11 dígitos (DDD + fixo/celular), coloca o 55 na frente.
 * 3. Qualquer outro tamanho (ex.: "5511987654321", já com o 55) volta como está.
 *
 * Ex.: "11987654321" → "5511987654321".
 */
export default function toWhatsappNumber(whatsapp) {
  const digits = String(whatsapp).replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
}
