const ACCEL_SERVICE = 'e95d0753-251d-470a-a062-fa1922dfa9a8';
const ACCEL_DATA_CHAR = 'e95dca4b-251d-470a-a062-fa1922dfa9a8';

const $ = (id) => document.getElementById(id);

let device = null;
let server = null;
let accelChar = null;

const btnConnect = $('btnConnect');
const btnDisconnect = $('btnDisconnect');

const xEl = $('x');
const yEl = $('y');
const zEl = $('z');
const angleEl = $('angle');

async function connect() {
  device = await navigator.bluetooth.requestDevice({
    filters: [{ namePrefix: 'BBC micro:bit' }],
    optionalServices: [ACCEL_SERVICE]
  });

  server = await device.gatt.connect();

  const service = await server.getPrimaryService(ACCEL_SERVICE);
  accelChar = await service.getCharacteristic(ACCEL_DATA_CHAR);

  await accelChar.startNotifications();
  accelChar.addEventListener('characteristicvaluechanged', onData);

  btnConnect.disabled = true;
  btnDisconnect.disabled = false;
}

function disconnect() {
  if (device && device.gatt.connected) {
    device.gatt.disconnect();
  }

  btnConnect.disabled = false;
  btnDisconnect.disabled = true;
}

function onData(event) {
  const dv = event.target.value;

  const x = dv.getInt16(0, true);
  const y = dv.getInt16(2, true);
  const z = dv.getInt16(4, true);

  xEl.textContent = x;
  yEl.textContent = y;
  zEl.textContent = z;

  const angle = Math.atan2(Math.sqrt(x*x + y*y), Math.abs(z)) * 180 / Math.PI;
  angleEl.textContent = Math.round(angle);
}

btnConnect.addEventListener('click', connect);
btnDisconnect.addEventListener('click', disconnect);
