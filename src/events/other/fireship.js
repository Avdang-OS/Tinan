module.exports = {
  name: /this has been (.+) in 100 seconds/,
  callback: (message) => {
    if (
      message.content.startsWith('this has been') &&
      message.content.endsWith('in 100 seconds') &&
      message.content != 'this has been in 100 seconds'
    ) message.channel.send('hit the like button and subscribe if you want to see more short videos like this thanks for watching and I will see you in the next one');
  }
};
