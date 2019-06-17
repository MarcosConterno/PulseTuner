import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import {
  Container, Text, ActionButtons, Connect, StatusBox,
} from './styles';
import { StepComponentProps } from '../StepComponentProps';
import Loader from '../../../components/Loader';
import BleService from '../../../services/BleService';

/**
 * Conexão com o bluetooth
 *
 * @param props
 */
export default function Step1(props: StepComponentProps) {
  const [preparing, setPreparing] = useState(true);
  const [connecting, setConnecting] = useState(false);

  // Função chamada ao iniciar o passo 1
  useEffect(() => {
    // Prepara o bluetooth para a conexão
    // (verifica se está ligado, etc)
    (async function () {
      try {
        await BleService.prepare();
      } catch (error) {
        Alert.alert('Ops...', 'Falha ao ligar o bluetooth, tente novamente...');
      }

      setPreparing(false);
    }());
  }, []);

  // Função que irá conectar o celular ao dispositivo bluetooth
  async function connect() {
    if (connecting) return;

    setConnecting(true);

    try {
      await BleService.connect();
      setConnecting(false);

      // Caso ocorra tudo certo, chama a próxima tela
      props.goToNext();
    } catch (error) {
      setConnecting(false);

      Alert.alert('Ops...', 'Falha ao conectar ao dispositivo, tente novamente...');
    }
  }

  return (
    <Container>
      <StatusBox>
        <Text>Aguardando conexão...</Text>
      </StatusBox>

      <ActionButtons>
        <Connect title="Conectar" onPress={connect} color="#38B2AC" />
      </ActionButtons>

      <Loader visible={preparing} message="Preparando dispositivos..." />
      <Loader visible={connecting} message="Conectando dispositivo..." />
    </Container>
  );
}
