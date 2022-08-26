// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});


if (context.params.event.data.options[0].name === "members") {

  // make API request
  let result = await lib.discord.guilds['@0.0.6'].preview.list({
    guild_id: `${context.params.event.guild_id}`
  });
  
  // Removing 3 robots
  let members_number = result.approximate_member_count - 3;
  let active_members_number = result.approximate_presence_count - 3;
  members_number = members_number.toString();
  //////
  
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
    bonus_message = `autant que la population de ${commune} (${departement})`;
  }
  ///bonus message END
  
  let messageResponse = await lib.discord.channels['@0.0.6'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: 
    `<@!${context.params.event.member.user.id}> : nous sommes **${members_number}** membres - ${bonus_message} - dont **${active_members_number}** en ligne! Et 3 robots.`
  });
  return messageResponse;
}

else if (context.params.event.data.options[0].name === "messages") {
  
  // make API request
  let messageslist = await lib.discord.channels['@0.2.2'].messages.list({
    channel_id: `${context.params.event.channel_id}`,
    limit: 1
  });
  
  //While loop init
  let latestmessageID = `${messageslist[0].id}`;
  let messageslistlength = 100;
  let messagecounter = 1;
  let whileloopcounter = 0;
  
  let sleep = async (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };
  
  //While loop execute
  while (messageslistlength === 100 && messagecounter < 2301) {
      whileloopcounter = whileloopcounter + 1;
      await sleep(630);    
      //Retrieve the 100max messages
      messageslist = await lib.discord.channels['@0.2.2'].messages.list({
        channel_id: `${context.params.event.channel_id}`,
        before: `${latestmessageID}`,
        limit: 100
      });
      messagecounter = messagecounter + messageslist.length;
      console.log(messagecounter);
      //While loop readjust
      messageslistlength = messageslist.length;
      latestmessageID = `${messageslist[(messageslistlength-1)].id}`;
  }
  
  if (messagecounter > 2300){
    let result = await lib.discord.channels['@0.2.2'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `<@!${context.params.event.member.user.id}> : il y a sur ce fil plus de 2300 messages.`
    });
  }
  else {
    let result = await lib.discord.channels['@0.2.2'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `<@!${context.params.event.member.user.id}> : il y a sur ce fil ${messagecounter} messages.`
    });
  }
}

else {
  
}
