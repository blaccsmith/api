import axios, { AxiosInstance } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method, body }: NextApiRequest = req;

	if (method !== 'POST') {
		res.status(405).json({
			statusCode: 405,
			message: 'Method not allowed',
		});
		return;
	}

	try {
		const { quantity }: any = body;

		const heroku: AxiosInstance = axios.create({
			baseURL: 'https://api.heroku.com/apps/blacc-twitterbot',
			timeout: 3000,
			headers: {
				Accept: 'application/vnd.heroku+json; version=3',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_HEROKU_API_KEY}`,
			},
		});

		const updates = {
			updates: [
				{
					quantity,
					size: 'Free',
					type: 'worker',
				},
			],
		};

		const herokuResponse: any = await heroku.patch('/formation', updates);
		res.status(200).json({ Response: herokuResponse?.data });
	} catch (error: any) {
		const parsedError = JSON.parse(error.message);
		res.status(500).json({ error: parsedError.details.errors });
	}
}
