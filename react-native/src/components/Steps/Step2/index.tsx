import React, { useState } from 'react';
import { StepComponentProps } from '../StepComponentProps';
import {
  Container, Text, Buttons, StartTuning, StartContainer,
} from './styles';
import StringButton from './StringButton';
import TunerService from '../../../services/TunerService';

/**
 * Seleção de corda para a afinação
 *
 * @param props
 */
export default function Step2(props: StepComponentProps) {
  const notes = ['e4', 'b3', 'g3', 'd3', 'a2', 'e2'];

  const [selectedNote, setSelectedNote] = useState('e4');

  // Inicia a afinação da corda selecionada
  function startTuning() {
    // Seta a nota selecionada no serviço de afinação
    TunerService.setSelectedNote(selectedNote);

    // Vai para a próxima tela
    props.goToNext();
  }

  return (
    <Container>
      <Text>Escolha uma corda para afinar</Text>

      <Buttons>
        {notes.map(note => (
          <StringButton
            key={note}
            note={note}
            selectedNote={selectedNote}
            onSelected={() => setSelectedNote(note)}
          />
        ))}
      </Buttons>

      <StartContainer>
        <StartTuning
          title="Iniciar Afinação"
          color="#38B2AC"
          onPress={startTuning}
          disabled={!selectedNote}
        />
      </StartContainer>
    </Container>
  );
}
