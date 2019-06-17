import React from 'react';
import { Container, Logo } from './styles';

const Header = () => (
  <Container>
    <Logo source={require('../../assets/images/Logo.png')} />
  </Container>
);

export default Header;
