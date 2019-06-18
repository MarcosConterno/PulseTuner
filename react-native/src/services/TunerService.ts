import Recording from 'react-native-recording';
import { Distance } from 'tonal';
import PitchService from './PitchService';

const MIDDLE_A = 440;
const SEMITONE = 69;
const NOTE_STRINGS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CENTS_TOLERANCE = 15;

class TunerService {
  private static instance: TunerService;

  private isTuning: boolean;

  private selectedNote: string;

  private centsSample: number[];

  private firstNoteTime: number;

  private constructor() {
    this.isTuning = false;
    this.selectedNote = '';
    this.centsSample = [];
    this.firstNoteTime = 0;
  }

  setSelectedNote(note: string) {
    this.selectedNote = note;
  }

  getSelectedNote() {
    return this.selectedNote;
  }

  static getInstance() {
    if (!TunerService.instance) {
      TunerService.instance = new TunerService();
    }

    return TunerService.instance;
  }

  // Inicia a afinação
  start({
    onNoteDetected,
    onTuningComplete,
  }: {
  onNoteDetected: (diffInCents: number) => void;
  onTuningComplete: () => void;
  }) {
    this.isTuning = true;

    Recording.init({
      bufferSize: 4096,
      sampleRate: 44100,
      bitsPerChannel: 16,
      channelsPerFrame: 1,
    });

    // Seta o evento ao encontrar uma frequência
    Recording.addRecordingEventListener((data: Float32Array) => {
      if (!this.isTuning) return;

      const diffInCents = this.calculateDiffInCents(PitchService.detect(data));

      if (diffInCents !== null && this.checkDetectedNote(diffInCents)) {
        if (this.firstNoteTime === 0) {
          this.firstNoteTime = new Date().getTime();
        }

        if (new Date().getTime() - this.firstNoteTime < 1000) {
          this.centsSample.push(diffInCents);
          return;
        }

        const centsAverage = Math.round(
          this.centsSample.reduce((a, b) => a + b, 0) / this.centsSample.length,
        );

        if (Math.abs(centsAverage) < CENTS_TOLERANCE) {
          onTuningComplete();
          this.centsSample = [];
          this.firstNoteTime = 0;
          return;
        }

        if (!isNaN(centsAverage)) {
          onNoteDetected(centsAverage);
        }

        this.centsSample = [];
        this.firstNoteTime = new Date().getTime();
      }
    });

    // Inicia a gravação do microfone
    Recording.start();
  }

  checkDetectedNote(diffInCents: number) {
    if (!diffInCents && diffInCents !== 0) {
      return false;
    }

    return Math.abs(diffInCents) <= 400;
  }

  // Busca a desafinação da nota desejada acordo com uma frequência recebida
  calculateDiffInCents(frequency: number | null): number | null {
    if (!frequency) return null;

    // De acordo com a frequencia calcula qual nota é
    const value = Math.round(12 * (Math.log(frequency / MIDDLE_A) / Math.log(2))) + SEMITONE;
    const noteName = NOTE_STRINGS[value % 12].toLowerCase(); // Nome da nota (c, c#, d, d#...)
    const octave = Math.floor(value / 12) - 1; // Oitava da nota (1, 2, 3, 4...)
    const semitones = Distance.semitones(this.selectedNote, `${noteName}${octave}`); // Quantidade de semitons de distância da nota selecionada

    if (!semitones && semitones !== 0) {
      return null;
    }

    return this.getCents(frequency, value) + semitones * 100;
  }

  // Busca os centésimos de afinação fora de um tom
  getCents(frequency: number, note: number) {
    const standardFrequency = MIDDLE_A * Math.pow(2, (note - SEMITONE) / 12);

    return Math.floor((1200 * Math.log(frequency / standardFrequency)) / Math.log(2));
  }

  // Para a afinação
  stop() {
    this.isTuning = false;

    Recording.stop();
  }
}

export default TunerService.getInstance();
