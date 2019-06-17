import { BleManager, Device } from 'react-native-ble-plx';
import { Base64 } from 'js-base64';
import { timeout } from 'promise-timeout';

const DEVICE_IDENTIFIER = 'C8:FD:19:37:1E:53';
const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

class BleService {
  private static instance: BleService;

  manager: BleManager;

  device: Device | null;

  isConnected: boolean;

  private constructor() {
    this.manager = new BleManager();
    this.device = null;
    this.isConnected = false;
  }

  static getInstance() {
    if (!BleService.instance) {
      BleService.instance = new BleService();
    }

    return BleService.instance;
  }

  async prepare() {
    return timeout(
      new Promise((resolve) => {
        const subscription = this.manager.onStateChange((state) => {
          if (state === 'PoweredOn') {
            subscription.remove();
            resolve();
          }
        }, true);
      }),
      10000,
    );
  }

  async connect() {
    await this.manager.connectToDevice(DEVICE_IDENTIFIER, { timeout: 5000 });

    this.device = await this.manager.discoverAllServicesAndCharacteristicsForDevice(
      DEVICE_IDENTIFIER,
    );

    this.isConnected = true;
  }

  send(data: string) {
    if (!this.isConnected || !this.device) return;

    const base64Value = Base64.encode(`${data}|`);

    this.device.writeCharacteristicWithoutResponseForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      base64Value,
    );
  }
}

export default BleService.getInstance();
