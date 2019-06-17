const DEFAULT_THRESHOLD = 0.1;
const DEFAULT_SAMPLE_RATE = 44100;
const DEFAULT_PROBABILITY_THRESHOLD = 0.1;

class PitchService {
  detect(buffer: Float32Array) {
    let bufferSize;
    for (bufferSize = 1; bufferSize < buffer.length; bufferSize *= 2);
    bufferSize /= 2;

    const yinBufferLength = bufferSize / 2;
    const yinBuffer = new Float32Array(yinBufferLength).fill(0);

    let probability;
    let tau;

    for (let t = 1; t < yinBufferLength; t++) {
      for (let i = 0; i < yinBufferLength; i++) {
        const delta = buffer[i] - buffer[i + t];
        yinBuffer[t] += delta * delta;
      }
    }

    yinBuffer[0] = 1;
    yinBuffer[1] = 1;

    let runningSum = 0;

    for (let t = 1; t < yinBufferLength; t++) {
      runningSum += yinBuffer[t];
      yinBuffer[t] *= t / runningSum;
    }

    for (tau = 2; tau < yinBufferLength; tau++) {
      if (yinBuffer[tau] < DEFAULT_THRESHOLD) {
        while (tau + 1 < yinBufferLength && yinBuffer[tau + 1] < yinBuffer[tau]) {
          tau++;
        }
        probability = 1 - yinBuffer[tau];
        break;
      }
    }

    if (tau == yinBufferLength || yinBuffer[tau] >= DEFAULT_THRESHOLD) {
      return null;
    }

    if (!probability || probability < DEFAULT_PROBABILITY_THRESHOLD) {
      return null;
    }

    let betterTau;

    const x0 = tau < 1 ? tau : tau - 1;
    const x2 = tau + 1 < yinBufferLength ? tau + 1 : tau;

    if (x0 === tau) {
      betterTau = yinBuffer[tau] <= yinBuffer[x2] ? tau : x2;
    } else if (x2 === tau) {
      betterTau = yinBuffer[tau] <= yinBuffer[x0] ? tau : x0;
    } else {
      const s0 = yinBuffer[x0];
      const s1 = yinBuffer[tau];
      const s2 = yinBuffer[x2];

      betterTau = tau + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
    }

    return DEFAULT_SAMPLE_RATE / betterTau;
  }
}

export default new PitchService();
