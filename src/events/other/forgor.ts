import type { Tinan } from '../../global';

export default {
  name: ['forgor'],
  callback: message => {
    message.react('💀');
  }
} as Tinan.OtherEvent;
