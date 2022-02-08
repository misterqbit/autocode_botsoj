// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let result;
let fils = [];

// make API request
let channels_list = await lib.discord.guilds['@0.2.2'].channels.list({
  guild_id: `642121138050170889`
});

await lib.discord.channels['@0.2.0'].messages.create({
  "channel_id": `${context.params.event.channel_id}`,
  "content": 
  `<@!${context.params.event.member.user.id}> : les fils actifs sont:`,
  "tts": false,
});

for (let i = 2; i < channels_list.length; i++) {

    if (channels_list[i].type != 0) {
      
    }
    else {
        result = await lib.discord.channels['@0.2.2'].threads.list({
          channel_id: `${channels_list[i].id}`, // required
          active: true
        });

        for (let j = 0; j < result.threads.length; j++) {
          fils[j] = `\n` + '#' + channels_list[i].name + '  >  #' + result.threads[j].name + `\n`;
          }

       if ((result.threads.length != 0)&&(fils.length != 0)) {
            await lib.discord.channels['@0.2.0'].messages.create({
              "channel_id": `${context.params.event.channel_id}`,
              "content": `${fils}`,
              "tts": false
            });
        }
    }
}
