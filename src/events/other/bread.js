const { multiReact } = require('../../utils/multiReact');

module.exports = {
  name: ['bread'],
  callback: async (message) => { await multiReact(message, '🍞🇧🇷🇪🇦🇩👍') }
};
