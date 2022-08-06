import { EmbedBuilder, ApplicationCommandOptionType, Colors } from 'discord.js';
import type { GuildMemberRoleManager, Role } from 'discord.js';
import type { Tinan } from '../global';

export default {
  name: 'demote',
  description: 'Demotes a user. (manager only)',
  options: [
    {
      name: 'user',
      description: 'User that will be demoted',
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: 'reason',
      description: 'Why you are demoting this user',
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  
  callback: async interaction => {
    let memberRoles = interaction.member?.roles as GuildMemberRoleManager;
    if (memberRoles.cache.some(role => ['993524668503949322', '986269171111297036'].includes(role.id))) {  // Check if a member has the manager role
      const member = (interaction.options as any).getMember('user');
      const reason = (interaction.options as any).getString('reason');
      const rolesToRemove = [
        // Main server
        '993598471456178248', // Design Lead
        '993562782756782181', // Senior Designer
        '993471541176184842', // Designer
        '993537552625705000', // Senior Developer
        '993471258371047455', // Developer
        '993529249128525878', // Contributor
        '993514545165389834', // AvdanOS Team

        // Test server
        '990841843497443349', // Senior developer
        '986269396890697738', // Developer
        '987642117813841960', // Contributor
        '997778183267037234', // Senior Sesigner
        '986269279701831740', // Designer
        '991332275205713950', // AvdanOS Team
      ];

      const removedRoles: string[] = [];

      // Reject bot users.
      if (member.user.bot) {
        const embed = new EmbedBuilder()
          .setTitle('You can not demote a bot.')
          .setColor(Colors.Red);

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // If managers
      if (member.roles.cache.some((role: Role) => ['993524668503949322', '986269171111297036'].includes(role.id))) {
        const embed = new EmbedBuilder()
          .setTitle('You can not demote a manager.')
          .setColor(Colors.Red)

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // Remove role from a user, if exists.
      rolesToRemove.forEach(id => {
        if (member.roles.cache.some((role: Role) => role.id === id)) {
          let role = interaction.guild?.roles.cache.get(id);
          member.roles.remove(role);
          removedRoles.push(`<@&${id}>`);
        }
      });

      const embed = new EmbedBuilder();

      if (removedRoles.length == 0) {
        embed
          .setTitle(`${member.user.username}#${member.user.discriminator} can't be demoted`)
          .setDescription('This user has no team manager roles')
          .setColor(Colors.Red);

        interaction.reply({ embeds: [embed], ephemeral: removedRoles.length == 0 });
        return;
      }

      // If roles were removed.
      embed
        .setTitle(`${member.user.username}#${member.user.discriminator} was demoted`)
        .setDescription('Removed roles:\n\n' + removedRoles.join('\n'))
        .setColor(Colors.Blue);

      const demotedNotify = new EmbedBuilder()
        .setTitle(`You were demoted by ${interaction.user.username}#${interaction.user.discriminator}`)
        .setDescription(reason ? `Reason: ${reason}` : 'No reason was provided')
        .setColor(Colors.Red);

      await member
        .send({ embeds: [demotedNotify] })
        .catch(() => embed.setFooter({ text: 'P.S: Bot failed to send a DM' }));
    
      interaction.reply({ embeds: [embed], ephemeral: removedRoles.length == 0 });

    } else {
      
    }
  }
} as Tinan.Command;
