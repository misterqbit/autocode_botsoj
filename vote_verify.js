// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let result = await lib.googlesheets.query['@0.3.0'].select({
  range: `votes!A:N`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
    {
      'ID': `${context.params.event.member.user.id}`,
      'TopicID': `${context.params.event.channel_id}`
    }
  ],
  limit: {
    'count': 0,
    'offset': 0
  },
});
if (result.rows[0] == null) {
  await lib.discord.channels['@0.0.6'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `@${context.params.event.member.user.username} : vous n'avez pas encore voté.`
  });
} 
else {
  let resultchannel = await lib.discord.channels['@0.0.6'].retrieve({
      channel_id: `918054781564637234`
  });
  let namesarray = [];
  let names;
  for (let i = 1; i < 11; i++) {
    namesarray[i] = result.rows[0].fields[i];
  }
  let namesarrayfiltered = namesarray.filter(e => e != `undefined`);
  let maxlength = namesarrayfiltered.length;
  for (let j = 0; j < maxlength; j++) {
    if (j==0) {
      names = namesarrayfiltered[j];
    }
    else {  
      names = names + '  ' + namesarrayfiltered[j];
    }
  }
  await lib.discord.channels['@0.0.6'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: [
      `@${context.params.event.member.user.username}, voici votre vote ${resultchannel.name} :`,
      `${names}`
    ].join('\n'),
  });
}
