import { multiReact } from '../../utils/multiReact';
import type { Tinan } from '../../global';

export default {
  name: ['akane', 'akane cat'],
  callback: async message => {
    await multiReact(message, '🅰️🇰🇦🇳🇪🐱');
  }
} as Tinan.OtherEvent;
