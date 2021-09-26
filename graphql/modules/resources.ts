import GraphQL from '@/clients/graphql';
import { reposQuery } from '@/clients/graphql/queries';
import Supabase from '@/clients/supabase';
import { createModule, gql } from 'graphql-modules';
import { RepoReq, Url } from '../../types';

const types = gql`
	type Query {
		getRepos(filter: String!): [Repository]
	}
	type Mutation {
		addRepo(url: String!): String
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
		updatedAt: String
	}
`;

const resolvers = {
	Query: {
		getRepos: async (_ = {}, { filter }: RepoReq) => {
			const supabase = new Supabase();

			const { data } = await supabase.getAll('resources');

			const repos = data?.filter((el) =>
				filter === 'approved' ? el.approved : el.pending
			);

			const gql = new GraphQL();
			const promises = (repos as any[]).map(async (repo) => {
				const [, owner, name] = repo.url.substring(8).split('/');
				return await gql.runQuery({
					query: reposQuery,
					variables: { owner, name },
				});
			});

			const resources = await Promise.all(promises);
			return resources.map((el) => el.repository);
		},
	},
	Mutation: {
		addRepo: async (_ = {}, { url }: Url) => {
			const supabase = new Supabase();

			const created_at: string = new Date(Date.now()).toISOString();
			const { error } = await supabase.insert('resources', {
				created_at: created_at,
				url,
			});

			return error
				? `Err: ${error.message}`
				: 'Thanks for the submission.';
		},
	},
};

export const ResourcesModule = createModule({
	id: 'Resources',
	dirname: __dirname,
	typeDefs: [types],
	resolvers: [resolvers],
});
