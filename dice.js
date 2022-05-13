// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let dices_number = context.params.event.data.options[0].value;
let dices_type = context.params.event.data.options[1].value;
let result = [];
result.push(`<@!${context.params.event.member.user.id}>`);
result.push('\n');
for (i=1; i<(dices_number+1); i++) {
  let diceresult = getRandomInt(1,dices_type);
  result.push("Dé "+i+": "+diceresult);
  result.push('\n');
  }
  
await lib.discord.channels['@0.2.2'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: result.join(' ')
});
