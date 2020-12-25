const childProcess = require('child_process');
const promisify = require('util').promisify;

const execFile = promisify(childProcess.execFile);

const input = rawValue => {
  if(rawValue == null) return Promise.reject(new Error('Please input a value'));
  const value = Number.parseInt(rawValue, 10);  // 必ず数値にする・変換できない場合は NaN になる
  if(Number.isNaN(value)) return Promise.reject(new Error('Input value is not a number'));
  if(value < 0 || value > 100) return Promise.reject(new Error('Expected a number between 0 and 100'));
  return Promise.resolve(value.toFixed(0));  // 整数の文字列にする
};

if(process.platform === 'darwin') {
  const osascript = cmd => execFile('osascript', ['-e', cmd]).then(result => result.stdout);
  
  module.exports.get = () => osascript('output volume of (get volume settings)').then(volume => Number.parseInt(volume, 10));
  module.exports.set = rawValue => input(rawValue).then(value => osascript(`set volume output volume ${value}`));  // 負数や100超でもエラーにはならない
  module.exports.isMuted = () => osascript('output muted of (get volume settings)').then(stdout => (`${stdout}`.trim() === 'true'));
  module.exports.mute = () => osascript('set volume with output muted');
  module.exports.unmute = () => osascript('set volume without output muted');
}
else if(process.platform === 'linux') {
  const amixer = (...args) => execFile('amixer', args).then(result => result.stdout);
  const getDefaultDevice = () => amixer()
    .then(stdout => {
      const defaultDeviceResult = (/Simple mixer control '([a-z0-9 -]+)',[0-9]+/i).exec(stdout);
      if(!defaultDeviceResult) return Promise.reject(new Error('Failed to parse amixer output default device'));
      return defaultDeviceResult[1];
    });
  const parseInfo = stdout => {
    const infoResult = (/[a-z][a-z ]*: Playback [0-9-]+ \[([0-9]+)%\] (?:[[0-9.-]+dB\] )?\[(on|off)\]/i).exec(stdout);
    if(!infoResult) return Promise.reject(new Error('Failed to parse amixer output info'));
    return {
      volume : Number.parseInt(infoResult[1], 10),
      isMuted: (infoResult[2] === 'off')
    };
  };
  const getInfo = () => getDefaultDevice()
    .then(defaultDevice => amixer('get', defaultDevice))
    .then(stdout => parseInfo(stdout));
  
  module.exports.get = () => getInfo().then(info => info.volume);
  module.exports.set = rawValue => {
    let value = null;
    return input(rawValue)
      .then(parsedValue => {
        value = parsedValue;
        return getDefaultDevice();
      })
      .then(defaultDevice => amixer('set', defaultDevice, `${value}%`))
      .then(stdout => parseInfo(stdout));
  };
  module.exports.isMuted = () => getInfo().then(info => info.isMuted);
  module.exports.mute = () => getDefaultDevice().then(defaultDevice => amixer('set', defaultDevice, 'mute')).then(stdout => parseInfo(stdout));;
  module.exports.unmute = () => getDefaultDevice().then(defaultDevice => amixer('set', defaultDevice, 'unmute')).then(stdout => parseInfo(stdout));;
}
else if(process.platform === 'win32') {
  const path = require('path');
  
  const executablePath = path.join(__dirname, 'loudness-win32.exe');  // adjust_get_current_system_volume_vista_plus
  const runProgram = arg => execFile(executablePath, [arg])
    .then(result => {
      const values = result.stdout.split(' ');
      return {
        volume : Number.parseInt(values[0], 10),
        isMuted: Boolean(Number.parseInt(values[1], 10))
      };
    });
  
  module.exports.get = () => runProgram().then(info => info.volume);
  module.exports.set = value => input(value)
    .then(value => {
      if(value === '0') value = '0.01';  // '0' が指定されても音量が 0 にならなかったので調整する
      return runProgram(value);
    });
  module.exports.isMuted = () => runProgram().then(info => info.isMuted);
  module.exports.mute = () => runProgram('mute');
  module.exports.unmute = () => runProgram('unmute');
}
else {
  throw new Error('Unsupported platform');
}
