// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// make API request
let result = await lib.discord.guilds['@0.0.6'].preview.list({
  guild_id: `${context.params.event.guild_id}`
});

let messageResponse = await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: 
  `<@!${context.params.event.member.user.id}> : nous sommes **${result.approximate_member_count}** membres dont **${result.approximate_presence_count}** en ligne!`
});
return messageResponse;
