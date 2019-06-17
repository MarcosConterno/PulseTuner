import React, { useState } from 'react';
import { View } from 'react-native';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

/**
 * Renderiza o conteúdo da página
 * de acordo com o passo atual
 */
export default function Steps() {
  const [step, setStep] = useState(1);

  // Função que retorna o componente
  // correspondente ao passo atual
  function getStepComponent() {
    if (step == 2) return Step2;
    if (step == 3) return Step3;
    return Step1;
  }

  function goToStep(step: number) {
    if (step < 1 || step > 3) return;

    setStep(step);
  }

  const StepComponent = getStepComponent();

  return (
    <View>
      <StepComponent
        currentStep={step}
        goToStep={goToStep}
        goToPrev={() => goToStep(step - 1)}
        goToNext={() => goToStep(step + 1)}
      />
    </View>
  );
}
