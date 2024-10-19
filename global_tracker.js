import Tracker from './lib/track'

let _globalTracker;

function randomId(length = 10) {
  const characters = '0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
  }

  return result;
}

const getInstance = () => {

  if (!_globalTracker) {
    // Initialize Tracker instance
    _globalTracker = new Tracker({
      userId: randomId(5), // current UserId
      deviceId: randomId(5), // current deviceId
      lang: 'en', // current language
      country: 'kr', // current country
      sessionTimeout: 360 // Session timeout, default is 360s
    });
  }

  return _globalTracker;
}

const globalTracker = getInstance();

export default globalTracker;