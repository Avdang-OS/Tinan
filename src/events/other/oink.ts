import type { Tinan } from '../../global';

export default {
  name: ['oink'],
  callback: message => {
    message.react('🐷')
  }
} as Tinan.OtherEvent;
