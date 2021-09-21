import { ApolloServer } from 'apollo-server-micro';
import { createApplication } from 'graphql-modules';
import { NextApiRequest, NextApiResponse } from 'next';
import { ResourcesModule } from '../../graphql/modules';

const application = createApplication({
	modules: [ResourcesModule],
});

const schema = application.createSchemaForApollo();
const apolloServer = new ApolloServer({
	schema,
	introspection: true,
});

const startServer = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if (req.method === 'OPTIONS') {
		res.end();
		return false;
	}

	await startServer;
	await apolloServer.createHandler({
		path: '/api',
	})(req, res);
}

export const config = {
	api: {
		bodyParser: false,
	},
};