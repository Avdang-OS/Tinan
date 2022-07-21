const multiReact = async (msg, ...reactions) => {
  for (const i of reactions) {
    for (const reaction of i) {
      try { 
        await msg.react(reaction);
      } catch (error) {
        console.error(error);
      }
    } 
  }
}
exports.multiReact = multiReact;
