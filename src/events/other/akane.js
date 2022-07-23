const { multiReact } = require('../../utils/multiReact');

module.exports = {
  name: ['akane', 'akane cat'],
  callback: async (message) => { await multiReact(message, '🅰️🇰🇦🇳🇪🐱') }
};
