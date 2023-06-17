export default async function handler(
  req,
  res
) {
  if (req.method === "GET") {
    const username = req.query.username;

    const response = await fetch(
      `https://discord.com/api/v9/guilds/${process.env.DISCORD_GUILD_ID}/members/search?query=${username}&limit=1000`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
      }
    );

    const searchResults = await response.json();

    const isMember = searchResults.some(
      (result) => result.user.username === username
    );

    res.status(200).json(isMember);
  }
}
