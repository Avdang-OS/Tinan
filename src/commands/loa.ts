import {
	EmbedBuilder, ActionRowBuilder, ButtonBuilder,
	ApplicationCommandOptionType, ButtonStyle, PermissionsBitField, 
	Colors, GuildMember, User
} from 'discord.js';

import type { Role, TextChannel, GuildMemberRoleManager } from 'discord.js';
import type { Tinan } from '../global';
import cfg from '../config.json';

export default {
	name: 'loa',
	description: 'Apply or Return LOA',
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'apply',
			description: 'Apply for LOA',
			options: [
				{
					name: 'github',
					description: 'Your GitHub username.',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: 'figma',
					description: 'Your Figma username.',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: 'reason',
					description: 'The reason for your leave',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: 'return',
					description: 'Time of return from leave',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'return',
			description: 'Return from LOA',
		},
	],

	callback: async interaction => {
		let memberRoles = interaction.member?.roles as GuildMemberRoleManager;
		const options = (interaction.options as any);

		if (options._subcommand === 'apply') {
			if (!memberRoles.cache.find(role => ['Developer', 'Designer'].includes(role?.name))) {
				const embed = new EmbedBuilder()
					.setTitle('You need the **Developer** or the **Designer** role to apply for LOA.')
					.setColor(Colors.Red)

				return interaction.reply({ embeds: [embed], ephemeral: true });
			}

			if (memberRoles.cache.find(role => role?.name === 'LOA')) {
				const embed = new EmbedBuilder()
					.setTitle('You are already set to LOA.')
					.setColor(Colors.Red)

				return interaction.reply({ embeds: [embed], ephemeral: true });
			}

			const serverMember = interaction.member as GuildMember;
			const loaRole = interaction.guild?.roles.cache.find(r => r.name === '[LOA]') as Role;
			const loaChannel = interaction.guild?.channels.cache.find(c => c.id === cfg.loaReports) as TextChannel

			const embed = new EmbedBuilder()
				.setTitle('LOA pending.')
				.setColor(Colors.Blue)
				.setFields([
					{ name: 'GitHub username', value: options.getString('github'), inline: true },
					{ name: 'Figma Username', value: options.getString('figma'), inline: true },
					{ name: 'Reason', value: options.getString('reason'), inline: true },
					{ name: 'Return', value: options.getString('return'), inline: true },
				])
				.setAuthor({ name: serverMember.user.tag, iconURL: serverMember.displayAvatarURL() });
			
			const buttons = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
				  .setCustomId('accept')
				  .setLabel('Accept')
				  .setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
				  .setCustomId('deny')
				  .setLabel('Deny')
				  .setStyle(ButtonStyle.Danger),
			);

			loaChannel
				.send({ embeds: [embed], components: [buttons as any] })
				.then(message => {
					const embed = new EmbedBuilder()
						.setTitle('LOA asked successfully.')
						.setColor(Colors.Green);

					interaction.reply({ embeds: [embed], ephemeral: true });
					
					const collector = message.channel.createMessageComponentCollector({
						filter:
							buttonInteraction => buttonInteraction.member.permissions.has(PermissionsBitField.Flags.Administrator),		
						max: 1, 
					});

					collector.on('end', collection => {
						let user = collection.first()?.member?.user as User;
						if (collection.first()?.customId === 'accept') {
							serverMember?.setNickname(`[LOA] ${serverMember.displayName}`); 
							serverMember?.roles.add(loaRole);
							embed.setTitle(`LOA granted by \`${user.tag}\``)
							embed.setColor(Colors.Green)

							message.edit({ embeds: [embed], components: [] });
						} else {
							embed.setTitle(`LOA denied by \`${user.tag}\``)
							embed.setColor(Colors.Red)

							message.edit({ embeds: [embed], components: [] });
						}
					})
				});
		} else if (options._subcommand === 'return') {
			if (!memberRoles.cache.find(role => ['Developer', 'Designer'].includes(role.name))) {
				const embed = new EmbedBuilder()
					.setTitle('You need the **Developer** or the **Designer** role to return from LOA.')
					.setColor(Colors.Red);
				
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}

			if (!memberRoles.cache.find(role => role.name === '[LOA]')) {
				const embed = new EmbedBuilder()
					.setTitle('You are not set to LOA.')
					.setColor(Colors.Red);
				
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}

			const member = interaction.member as GuildMember;
			const loaRole = interaction.guild?.roles.cache.find(role => role.name === '[LOA]') as Role;
			const loaChannel = interaction.guild?.channels.cache.find(channel => channel.id === cfg.loaReports);


			const userTag = `${member.user.username}#${member.user.discriminator}`

			const returnEmbed = new EmbedBuilder()
				.setTitle('Returned from their LOA.')
				.setColor(Colors.Blue)
				.setAuthor({ name: userTag, iconURL: member.user.displayAvatarURL() });

			if (member.displayName.slice(0, 6) !== '[LOA] ') {
				await member.roles.remove(loaRole);
				await (loaChannel as TextChannel).send({ embeds: [returnEmbed] });

				const embed = new EmbedBuilder()
					.setTitle('Returned from LOA.\nℹ It seems that your nickname was altered during your LOA, no actions will be executed on your nickname.')
					.setColor(Colors.Green);

				return interaction.reply({ embeds: [embed], ephemeral: true });
			}

			try {
				await member.setNickname(member.displayName.slice(6));
				await member.roles.remove(loaRole);
				await (loaChannel as TextChannel).send({ embeds: [returnEmbed] });

				const embed = new EmbedBuilder()
					.setTitle('Returned from LOA')
					.setColor(Colors.Green)
				
				interaction.reply({ embeds: [embed], ephemeral: true });
			} catch (err) {
				console.log(err);

				const embed = new EmbedBuilder()
					.setTitle('Something went wrong')
					.setColor(Colors.Red)
				
				interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}
	}
} as Tinan.Command;
