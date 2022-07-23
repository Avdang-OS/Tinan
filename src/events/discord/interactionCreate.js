const { EmbedBuilder, InteractionType, Colors } = require('discord.js');
const { commands } = require('../../handlers/cmdHandler');

module.exports = {
  callback: async (client) => {
    client.on('interactionCreate', async (interaction) => {
      if (interaction.type === InteractionType.ApplicationCommand) {
        console.log(commands);
        try {
          for (cmd of commands) { if (cmd.name === interaction.commandName) await cmd.callback(interaction), () => {}; }
        } catch (error) {
          console.error(error);
  
          const embed = new EmbedBuilder()
            .setTitle('An error occured while executing that command.')
            .setColor(Colors.Red)
          interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }
    })
  }
};
