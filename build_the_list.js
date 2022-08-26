// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if (context.params.event.channel_id == '1012309764677582910') {


    // make API request
    let latestmessage = await lib.discord.channels['@0.2.2'].messages.list({
      channel_id: `${context.params.event.channel_id}`,
      limit: 1
    });

    //While loop init
    let latestmessageID = `${latestmessage[0].id}`;
    let messageslistlength = 100;
    let messagecounter = 1;
    let whileloopcounter = 0;

    let results = [];
    let value;
    let resultsArray =[];

    let sleep = async (ms) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    };
    await sleep(500);    
    
    
    //While loop execute
    while (messageslistlength === 100 && messagecounter < 2301) {
        whileloopcounter = whileloopcounter + 1;
        await sleep(300);    
        console.log(messagecounter);
        
        //Retrieve the 100max messages
        let messagesList = await lib.discord.channels['@0.3.2'].messages.list({
          channel_id: `${context.params.event.channel_id}`,
          before: `${latestmessageID}`,
          limit: 100
        });

        async function GetHearts (indexH,jH) 
        {
          if (messagesList[indexH].reactions[jH].emoji.name == '❤️')
          {
            let emojisCount = messagesList[indexH].reactions[jH].count;
            let postContent = messagesList[indexH].content.toString();
            var newValue = {};
            newValue.count = emojisCount;
            for (let l = 0;l < emojisCount;l++) {
              postContent += ' ❤️';
            }
            newValue.content = postContent;
            results.push(newValue);
          }
        }

        for (let i = 0; i < messagesList.length; i++) {
          if (messagesList[i].reactions)
            {
        //      console.log(messagesList[i].reactions);
              for (let j = 0; j < messagesList[i].reactions.length; j++) {
                    GetHearts(i,j);
              }
          }
        }

        messagecounter = messagecounter + messagesList.length;

        //While loop readjust
        messageslistlength = messagesList.length;
        latestmessageID = `${messagesList[(messageslistlength-1)].id}`;
    }

    if (messagecounter > 2300){
      console.log(`warning message > 2300`);
      /*await lib.discord.channels['@0.2.2'].messages.create({
        channel_id: `${context.params.event.channel_id}`,
        content: `<@!${context.params.event.member.user.id}> : il y a sur ce fil plus de 2300 messages.`
      });*/
    }

    results.sort((a,b) => (a.count < b.count) ? 1:-1)

    for (let k = 0; k < results.length; k++) {
      console.log(k);
      let newcontent = (k+1);
      newcontent = newcontent.toString();
      newcontent += " ";
      newcontent += results[k].content;
      //newcontent += "\n";
      //console.log(newcontent);
      resultsArray.push(`${newcontent}`);
      //console.log(resultsArray);
    }
    resultsArray = resultsArray.join("\n");

    await lib.discord.channels['@0.0.6'].messages.create({
        channel_id: `${context.params.event.channel_id}`,
        content: resultsArray
    });
}

else {
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `<@!${context.params.event.member.user.id}> : Cette commande n'est permise que dans un fil #LISTE`
  });
}
