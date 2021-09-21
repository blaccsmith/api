import GraphQL from '@/clients/graphql';
import { reposQuery } from '@/clients/graphql/queries';
import Supabase from '@/clients/supabase';
import { createModule, gql } from 'graphql-modules';
import { Url } from '../../types';

const types = gql`
	type Query {
		getResources: [Repository]
	}

	type Topic {
		name: String
	}

	type Node {
		topic: Topic
	}

	type NestedTopic {
		nodes: [Node]
	}

	type Repository {
		url: String
		name: String
		description: String
		stargazerCount: Int
		repositoryTopics: NestedTopic
		openGraphImageUrl: String
		uodatedAt: String
	}
`;

const resolvers = {
	Query: {
		getResources: async (_ = {}, { url }: Url) => {
			const supabase = new Supabase();

			const { data, error: err } = await supabase.getAll('resources');

			const gql = new GraphQL();
			const promises = (data as any[]).map(async (repo) => {
				const [, owner, name] = repo.url.substring(8).split('/');
				return await gql.runQuery({
					query: reposQuery,
					variables: { owner, name },
				});
			});
			const resources = await Promise.all(promises);
			return resources;
		},
	},
};

export const ResourcesModule = createModule({
	id: 'Resources',
	dirname: __dirname,
	typeDefs: [types],
	resolvers: [resolvers],
});
