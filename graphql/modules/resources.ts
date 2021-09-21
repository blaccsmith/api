import { createModule, gql } from 'graphql-modules';

const types = gql`
	type Query {
		getResources: [String]
	}
`;

const resolvers = {
	Query: {
		getResources: async () => {
			return ['welcome', 'to','apollo']
		}
	},
};

export const ResourcesModule = createModule({
	id: 'Resources',
	dirname: __dirname,
	typeDefs: [types],
	resolvers: [resolvers],
});