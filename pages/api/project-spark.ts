import { Client } from 'discord.js';
import type { NextApiRequest, NextApiResponse } from 'next';

export const client = new Client({
	intents: ['GUILDS', 'GUILD_MEMBERS'],
	partials: ['CHANNEL'],
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method }: NextApiRequest = req;

	if (method !== 'POST') {
		res.status(405).json({
			statusCode: 405,
			message: 'Method not allowed',
		});
		return;
	}

	await client.login(process.env.DISCORD_TOKEN as string);

	client.on('ready', readyClient => {
		const guild = readyClient.guilds.cache.get(
			process.env.GUILD_ID as string
		);

		const moderators = ['6883', '1108', '8124', '0621', '7023', '9660'];

		// Remove all roles from members
		guild?.members.cache.forEach(member => {
			if (!moderators.includes(member.id)) {
				member.roles.cache.forEach(role => {
					member.roles.remove(role);
				});
			}
		});

		// Add OG Member role to all members in the guild
		guild?.members.cache.forEach(member => {
			member.roles.add(process.env.OG_MEMBER_ROLE_ID as string);
			member.roles.add(process.env.SPECTATOR_ROLE_ID as string);
		});

		// Delete all channels
		const dc = readyClient.channels.cache.map(c => c.delete());

		// New channels
		const newChannels = [
			'annoucements',
			'general',
			'welcome',
			'showcase',
			'suggestions',
			'random',
			'coding-questions',
			'coding-resources',
			'100-days-of-code',
			'career-questions',
			'career-resources',
			'career-opportunities',
		];

		// Create community guildlines open to all members
		guild?.channels.create('community-guidelines', {
			type: 'GUILD_TEXT',
		});

		// Make other channels private for spectators
		newChannels.forEach(channel => {
			guild?.channels.create(channel, {
				type: 'GUILD_TEXT',
				permissionOverwrites: [
					{
						id: process.env.SPECTATOR_ROLE_ID as string,
						deny: ['VIEW_CHANNEL'],
					},
				],
			});
		});

		res.status(200).json({ message: 'Project Sparked' });
	});
}
