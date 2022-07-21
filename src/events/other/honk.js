const { multiReact } = require('../../utils/multiReact');

module.exports = {  
  name: ['honk'],
  callback: async (message) => {
    // const goosStanding = await message.guild.emojis.fetch('993799647015481397').catch(() => { return '🦆' });
    await multiReact(message, '🦆🇭🇴🇳🇰👍') 
  }
};
