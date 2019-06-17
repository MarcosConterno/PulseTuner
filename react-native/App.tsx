import React, { useEffect } from 'react';
import { PermissionsAndroid, View, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Header from './src/components/Header';
import Steps from './src/components/Steps';
import Footer from './src/components/Footer';

/**
 * Componente principal do aplicativo
 */
export default function App() {
  // Função chamada ao iniciar o componente principal
  useEffect(() => {
    // Função que pede as permissões necessárias
    // (localização [bluetooth] e gravação de áudio)
    (async () => {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    })();
  }, []);

  return (
    <>
      <StatusBar backgroundColor="#44337A" barStyle="light-content" />
      
      <LinearGradient
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={['#44337A', '#805AD5']}
      >
        <View style={{ flex: 1 }}>
          <Header />

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Steps />
          </View>

          <Footer />
        </View>
      </LinearGradient>
    </>
  );
}
