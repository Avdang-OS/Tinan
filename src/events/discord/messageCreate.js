const fs = require('fs');
const path = require('path');

module.exports = {
  callback: async (client) => {
    client.on('messageCreate', (message) => {
      const otherEvents = [];
      const eventPath = './events';
      
      fs.readdirSync(path.join(process.cwd(), eventPath, '/other')).filter(file => file.endsWith('.js')).forEach(async file => {
        const pull = require(path.join(process.cwd(), eventPath, '/other', file));
        otherEvents.push(pull);
        
        try {
          // loop through the possible events, make them lowercase and check if the message contains it (if it does, execute the event)
          for (evt of otherEvents) {
            for (i of evt.name) {
              console.log(i);
              if (message.content.toLowerCase().includes(i)) {
                if (evt.callback.embeds) for (const embed of evt.callback.embeds) { message.reply({ embeds: [embed] }) };
              }
            }
            await evt.callback(message), () => {};
          }
        } catch (error) {
          console.error(error);
        }
      });
    })
  }
};
