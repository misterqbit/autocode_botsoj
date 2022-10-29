// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if (
  (context.params.event.channel_id == '1012309764677582910')       //3DS
||(context.params.event.channel_id == '1014956633933238363')       //WiiU
||(context.params.event.channel_id == '1017302312919777331')       //Multiplatform PS3+X360
||(context.params.event.channel_id == '1017707663938818072')       //Exclus PS3
||(context.params.event.channel_id == '1019894892241096764')       //Mangas
||(context.params.event.channel_id == '1022122118508457994')       //Animes Series
||(context.params.event.channel_id == '1023560399016177785')       //Animes Films
||(context.params.event.channel_id == '1025092127367123004')       //Visual Novels
||(context.params.event.channel_id == '1026089163365290034')       //Films
||(context.params.event.channel_id == '1027211080897929286')       //Séries TV
||(context.params.event.channel_id == '1027666143206449222')       //Wii
||(context.params.event.channel_id == '1031533133058801734')       //NeoGeo
||(context.params.event.channel_id == '1034380787245658172')       //GBA


)
{    
    // make API request
    let latestmessage = await lib.discord.channels['@0.2.2'].messages.list({
      channel_id: `${context.params.event.channel_id}`,
      limit: 1
    });
    //console.log(latestmessage);

    //While loop init
    let latestmessageID = `${latestmessage[0].id}`;
    let messageslistlength = 100;
    let messagecounter = 1;
    let whileloopcounter = 0;

    let results = [];
    let CommandOption = context.params.event.data;
    
    ////// random generated content
    let phrases = ["un déplacement intergalactique vers Alpha Centauri","les 260 jours du voyage vers Mars", "un boulot de gardien.ne de phare", "vivre sur une île déserte... jusqu'à la montée des mers", "être affecté.e sur un poste de recherche en Antartique", "faire l'ermite dans une grotte bien équipée", "le prochain confinement", "son bunker anti-atomique", "se perdre dans la forêt amazonienne avant sa complète déforestation", "s'enfermer dans la panic room d'un.e milliardaire", "se cacher dans une ville fantôme", "tenir un magasin d'anoraks au milieu du Sahara"];
    let phrasesIndex = Math.floor(Math.random() * phrases.length);
    if (CommandOption.options.length > 0) {
      results.push(`Pour ${phrases[phrasesIndex]}, <@${context.params.event.member.user.id}> emporterait :`);
    }
    ////////////////////////////////
    
    let value;
    let resultsArray =[];
    
    let sleep = async (ms) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    };
    await sleep(250);    
    
    
    //While loop execute
    while (messageslistlength === 100 && messagecounter < 2301) {
        whileloopcounter = whileloopcounter + 1;
        await sleep(400);    
        //console.log(messagecounter);
        
        //Retrieve the 100max messages
        let messagesList = await lib.discord.channels['@0.3.2'].messages.list({
          channel_id: `${context.params.event.channel_id}`,
          before: `${latestmessageID}`,
          limit: 100
        });

        async function GetHearts (indexH,jH) 
        {
          if ((messagesList[indexH].reactions[jH].emoji.name == '❤️') && (messagesList[indexH].reactions[jH].count > 0))
          {
            let emojisCount = messagesList[indexH].reactions[jH].count;
            let postContent = messagesList[indexH].content.toString();
            var newValue = {};
            console.log(CommandOption.options);
            console.log(messagesList[indexH].content);
            console.log(messagesList[indexH].reactions[jH]);
            if (CommandOption.options.length > 0) { ///////////////////////////////////////////////////////////high fidelity ON
              if (messagesList[indexH].reactions[jH].me === "true") {
                  results.push(`❤️ ${messagesList[i].content} ❤️`);
              }
            }
            else {
              newValue.count = emojisCount;
              postContent += '     ❤️ x ';
              postContent += emojisCount;
              //postContent += ' ️] https://discord.com/channels/342731229315072000/1012309764677582910/';
              //postContent += messagesList[indexH].id;
              /*for (let l = 0;l < emojisCount;l++) {
                postContent += ' ❤️';
              }*/
              newValue.content = postContent;
              results.push(newValue);
            }
          }
        }
        
        for (let i = 0; i < messagesList.length; i++) {
          if (messagesList[i].reactions)
            {
              for (let j = 0; j < messagesList[i].reactions.length; j++) {
                GetHearts(i,j);
            }
          }
          else {}
        }

        messagecounter = messagecounter + messagesList.length;

        //While loop readjust
        messageslistlength = messagesList.length;
        latestmessageID = `${messagesList[(messageslistlength-1)].id}`;
    }

    if (messagecounter > 2300){
      console.log(`warning message > 2300`);
      await lib.discord.channels['@0.2.2'].messages.create({
        channel_id: `${context.params.event.channel_id}`,
        content: `<@!${context.params.event.member.user.id}> : il y a sur ce fil plus de 2300 messages.`
      });
    }
    
    if (CommandOption.options.length === 0) { /////////////////////////////////////////////////////////////////////////////high_fidelity = null
        results.sort((a,b) => (a.count < b.count) ? 1:-1)
        var position = 0;
        for (let k = 0; (k < results.length) && (k < 45); k++) {
          let newcontent = 0;
          if (k > 0) {
            if((results[k-1].content.slice(-2)) == (results[k].content.slice(-2))){
              //position = (k+1);
              newcontent = "|  ";
            }
            else {
              position = position + 1;
              newcontent = "**"+position+"**";
            }
          }
          else {
            position = 1;
            newcontent = "**"+position+"**";
          }

          newcontent = newcontent.toString();
        // console.log(newcontent);
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
      if (results.length === 0) {
              results.push('rien du tout!');
      }
      
      results = results.join("\n");
      await lib.discord.channels['@0.0.6'].messages.create({
        channel_id: `${context.params.event.channel_id}`,
        content: results
      });
    }
}

else {
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `<@!${context.params.event.member.user.id}> : Cette commande n'est permise que dans un fil #LISTE`
  });
}
