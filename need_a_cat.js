// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

//NEED_A_CAT
const meow = require("random-meow");
// [note] You can use async/await
meow().then(url => console.log(url)).catch(console.error);

let url = await meow()

await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: context.params.event.channel_id,
      content: `${url}`
});


//Send pong test command
//await lib.discord.channels['@0.2.0'].messages.create({
//  channel_id: context.params.event.channel_id,
//  content: `Pong!`
//});
