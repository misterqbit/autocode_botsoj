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



// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// make API request
let result = await lib.discord.guilds['@0.0.6'].preview.list({
  guild_id: `${context.params.event.guild_id}`
});

// removing 3 robots
let members_number = result.approximate_member_count - 3;
let active_members_number = result.approximate_presence_count - 3;
members_number = members_number.toString();
/////

///bonus message START
let bonus_message = '';

let population = await lib.googlesheets.query['@0.3.0'].select({
      range: `insee2019!A:C`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
        'pop__contains' : `${members_number}`
                  }
      ],
      limit: {
        'count': 0,
        'offset': 0
      },
});
/*console.log(population.rows[0]);
console.log(members_number);*/
if (population.rows[0] != null) {
  let commune = population.rows[0].fields.comm;
  let departement = population.rows[0].fields.dep;
  bonus_message = ` Soit autant que la population de ${commune}, dans le ${departement}`;
}
///bonus message END


let messageResponse = await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: 
  `<@!${context.params.event.member.user.id}> : nous sommes **${members_number}** membres dont **${active_members_number}** en ligne! Et 3 robots.${bonus_message}`
});
return messageResponse;
