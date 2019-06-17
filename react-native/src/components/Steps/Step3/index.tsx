import React, { useEffect, useState } from 'react';
import { View, Button } from 'react-native';
import { StepComponentProps } from '../StepComponentProps';
import TunerService from '../../../services/TunerService';
import BleService from '../../../services/BleService';
import { Text } from './styles';

/**
 * Processo de afinação
 *
 * @param props
 */
export default function Step3(props: StepComponentProps) {
  const [tuning, setTuning] = useState(false);
  const [diffInCents, setDiffInCents] = useState(0);

  // Função chamada ao iniciar o passo 3
  useEffect(() => {
    startTuner();

    return () => {
      TunerService.stop();
    };
  }, []);

  // Função que inicia a afinação
  function startTuner() {
    setTuning(true);

    TunerService.start({ onNoteDetected, onTuningComplete });
  }

  // Função que para a afinação
  function stopTuner() {
    props.goToPrev();
  }

  // Função chamada ao encontrar uma nota no afinador
  function onNoteDetected(diffInCents: number) {
    setDiffInCents(diffInCents);
    BleService.send(diffInCents.toString());
  }

  // Função chamada ao completar a afinação
  function onTuningComplete() {
    props.goToPrev();
  }

  return (
    <View>
      <Text>{`${diffInCents} c`}</Text>
      {tuning && <Button title="Parar afinação" onPress={stopTuner} color="#E53E3E" />}
      {!tuning && <Button title="Iniciar afinação" onPress={startTuner} color="#38B2AC" />}
    </View>
  );
}
