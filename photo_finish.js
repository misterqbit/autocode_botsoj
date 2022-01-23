//displays exact message timestamp

// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let messageID = context.params.event.data.options[0].value;
console.log(messageID);

let result = await lib.discord.channels['@0.0.6'].messages.retrieve({
  message_id: `${context.params.event.data.options[0].value}`,
  channel_id: `${context.params.event.channel_id}`
});

let hour = result.timestamp.substring(11,100);
hour = hour.substring(0,15);

await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: context.params.event.channel_id,
  content: [
    `<@${context.params.event.member.user.id}> :`,
//    `>>> Message ID : ${messageID}`,
    `>>> Le message "${result.content}" de ${result.author.username} a été posté exactement à ${hour}`,
  ].join('\n'),
  tts : false
  
});
