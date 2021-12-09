// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});


//VOTETHREAD_IS_BALLOT_BOX
// Using Node.js 14.x +
// use "lib" package from npm
if ((context.params.event.member.user.id = `296380281311723542`)      //notarobot
 || (context.params.event.member.user.id = `864750688764559390`)      //yaourt
 || (context.params.event.member.user.id = `265376610763538452`)      //sad_vlad
 || (context.params.event.member.user.id = `341653406634475520`)) {    //nawre
    // make API request
    let typingindicator = await lib.discord.channels['@0.2.2'].typing.create({
      channel_id: `${context.params.event.channel_id}`
    });
    
    // make API request
    let TopicRetrieve = await lib.discord.channels['@0.2.2'].retrieve({
      channel_id: `${context.params.event.channel_id}`
    });

    let messageslist = await lib.discord.channels['@0.2.2'].messages.list({
      channel_id: `${context.params.event.channel_id}`,
      limit: 1
    });
    //While loop init
    let latestmessageID = `${messageslist[0].id}`;
    let messageslistlength = 100;
    let vote;
    let votecounter = 0;
    let whileloopcounter = 0;
    
    //While loop execute
    while (messageslistlength === 100) {
        whileloopcounter = whileloopcounter + 1;
        console.log(`whileloopcounter = ${whileloopcounter}`);
        //Retrieve the 100max messages
        messageslist = await lib.discord.channels['@0.2.2'].messages.list({
          channel_id: `${context.params.event.channel_id}`,
          before: `${latestmessageID}`,
          limit: 100
        });
        
        //While loop readjust
        messageslistlength = messageslist.length;
        latestmessageID = `${messageslist[(messageslistlength-1)].id}`;
        
        //Log the 100max messages in google sheet
        let fieldsetsarray = [];
        for (let i = 0; i < messageslistlength; i++) {
                vote = messageslist[i].content.split('//');
                votecounter = votecounter + 1;
                fieldsetsarray.push(
                  {
                  'TopicName': `${TopicRetrieve.name}`,
                  'TopicID': `${messageslist[i].channel_id}`,
                  'ID': `${messageslist[i].author.id}`,
                  'Gamer': `${messageslist[i].author.username}`,
                  '1': `${vote[0]}`,
                  '2': `${vote[1]}`,
                  '3': `${vote[2]}`,
                  '4': `${vote[3]}`,
                  '5': `${vote[4]}`,
                  '6': `${vote[5]}`,
                  '7': `${vote[6]}`,
                  '8': `${vote[7]}`,
                  '9': `${vote[8]}`,
                  '10': `${vote[9]}`
                  }
                );
              }              
                await lib.googlesheets.query['@0.3.0'].insert({
                  range: `votes!A:N`,
                  fieldsets: fieldsetsarray
                });
    }
    // make API request
    let result = await lib.discord.channels['@0.2.2'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `Fin de l'enregistrement de ${votecounter} vote(s).`
    });
}
else {
  let result = await lib.discord.channels['@0.2.2'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `Sorry, you don't have access to this command.`
  });
}
