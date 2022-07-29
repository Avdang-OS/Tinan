import type { Tinan } from '../../global';

/**
 * @file This is an example of an event that will react to the message if you say 'reaction example'.
 * @author AvdanOS
 */

export default {
  name: ['reaction example'],
  callback: message => {
    message.react('👋');
  }
} as Tinan.OtherEvent;
