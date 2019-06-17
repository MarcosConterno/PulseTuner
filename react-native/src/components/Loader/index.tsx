import React from 'react';
import {
  Modal, Container, Box, Loading, Message,
} from './styles';

interface Props {
  visible: boolean;
  message?: string;
}

const Loader = (props: Props) => (
  <Modal visible={props.visible} transparent>
    <Container>
      <Box>
        <Loading color="#805AD5" />
        {props.message && <Message>{props.message}</Message>}
      </Box>
    </Container>
  </Modal>
);

export default Loader;
