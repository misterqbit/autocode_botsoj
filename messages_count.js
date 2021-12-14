// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// make API request
let typingindicator = await lib.discord.channels['@0.2.2'].typing.create({
  channel_id: `${context.params.event.channel_id}`
});

let messageslist = await lib.discord.channels['@0.2.2'].messages.list({
  channel_id: `${context.params.event.channel_id}`,
  limit: 1
});

//While loop init
let latestmessageID = `${messageslist[0].id}`;
let messageslistlength = 100;
let messagecounter = 1;
let whileloopcounter = 0;


//While loop execute
while (messageslistlength === 100) {
    whileloopcounter = whileloopcounter + 1;
    //Retrieve the 100max messages
    messageslist = await lib.discord.channels['@0.2.2'].messages.list({
      channel_id: `${context.params.event.channel_id}`,
      before: `${latestmessageID}`,
      limit: 100
    });
    messagecounter = messagecounter + messageslist.length;
    //While loop readjust
    messageslistlength = messageslist.length;
    latestmessageID = `${messageslist[(messageslistlength-1)].id}`;
}
// make API request
let result = await lib.discord.channels['@0.2.2'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: `Il y a sur ce fil ${messagecounter} messages.`
});
