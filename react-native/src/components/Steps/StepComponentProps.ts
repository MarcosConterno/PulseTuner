export interface StepComponentProps {
  currentStep: number;
  goToStep(step: number): void;
  goToPrev(): void;
  goToNext(): void;
}
