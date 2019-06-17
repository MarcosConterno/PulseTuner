#include <SoftwareSerial.h>
#include <Stepper.h> 

// Pinos do bluetooth
const int BTRX = 2;
const int BTTX = 3;

// Pinos do motor de passo
const int IN1 = 8;
const int IN2 = 9;
const int IN3 = 10;
const int IN4 = 11;

const int stepsPerRevolution = 500;

int cents;

// Controles dos módulos
SoftwareSerial SerialBT(BTRX, BTTX);
Stepper MyStepper(stepsPerRevolution, IN1, IN3, IN2, IN4);

void setup() {
  Serial.begin(9600);

  SerialBT.begin(9600);

  // Quanto menor a velocidade mais torque
  MyStepper.setSpeed(20);
  
  Serial.println("Aguardando dados...");
}


void loop() {
  if (SerialBT.available()) {
    cents = SerialBT.readStringUntil('|').toInt() * -1;
    
    Serial.println(cents);

    MyStepper.step(cents);
  }
} 
