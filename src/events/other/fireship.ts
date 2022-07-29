import type { Tinan } from '../../global';

export default {
  name: [/this has been (?<topic>.+) in 100 seconds/gi],
  callback: (message, { topic: _ }) => {
    message.channel.send('hit the like button and subscribe if you want to see more short videos like this thanks for watching and I will see you in the next one');
  }
} as Tinan.OtherEventRegExp<['topic']>;
