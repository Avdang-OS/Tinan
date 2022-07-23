const fs = require('fs');
const path = require('path');

module.exports = async (client) => {  
  const discordEvents = [];
  const eventPath = './events';

  fs.readdirSync(path.join(process.cwd(), eventPath, '/discord')).filter(file => file.endsWith('.js')).forEach(async file => {
    const pull = require(path.join(process.cwd(), eventPath, '/discord', file));
    discordEvents.push(pull);

    try {
      for (evt of discordEvents) { await client.on(evt.callback(client), () => { }) }
    } catch (error) {
      console.error(error);
    }
  });
};
