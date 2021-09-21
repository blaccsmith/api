export interface Repository {
	url: string;
	name: string;
	description: string;
	stargazerCount: number;
	repositoryTopics: {
		nodes: [
			{
				topic: { name: string };
			}
		];
	};
	openGraphImageUrl: string;
	updatedAt: string;
}

export interface Url {
    url: string
}