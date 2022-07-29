import { multiReact } from '../../utils/multiReact';
import type { Tinan } from '../../global';

export default {
  name: ['honk'],
  callback: async message => {
    // const goosStanding = await message.guild.emojis.fetch('993799647015481397').catch(() => { return '🦆' });
    await multiReact(message, '🦆🇭🇴🇳🇰👍') 
  }
} as Tinan.OtherEvent;
