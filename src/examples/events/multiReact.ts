import { multiReact } from '../../utils/multiReact';
import type { Tinan } from '../../global';

/**
 * Do NOT mistake with multiReact in the utils folder.
 * @file This is an example of an event that will react to the message with multiple reactions if you say 'multiple reaction example'.
 * @author AvdanOS
 */

export default {
  name: ['multiple reaction example'],
  callback: async message => {
    await multiReact(message, '🇭🇮');
  }
} as Tinan.OtherEvent;
