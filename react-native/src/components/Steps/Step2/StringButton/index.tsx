import React from 'react';
import { Container, Button } from './styles';

interface Props {
  note: string;
  selectedNote: string;
  onSelected: (note: string) => void;
}

const StringButton = ({ note, selectedNote, onSelected }: Props) => (
  <Container>
    <Button
      title={note.toUpperCase()}
      onPress={() => onSelected(note)}
      color={note === selectedNote ? '#B794F4' : '#805AD5'}
    />
  </Container>
);

export default StringButton;
