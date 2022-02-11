// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const channelId = '941250672811212810';
const guildId = '342731229315072000';

async function DeleteMessage(messageId) {
  await lib.discord.channels['@0.0.6'].messages.destroy({
    message_id: messageId, 
    channel_id: channelId
  });
}
//if (context.params.event.channel_id == '940724611383980033') {
      let messagesList = await lib.discord.channels['@0.0.6'].messages.list({
        channel_id: channelId,
        limit: 50
      });
/*      for (let j = 0; j < messagesList.length; j++) {
        setTimeout(DeleteMessage(messagesList[j].id), delayInMilliseconds);
      }*/
      for (message of messagesList) {
        await DeleteMessage(message.id);
      }


      let text = []; // recueillera l'assemblage du texte affiché dans le message
      let hasOneResult = false; // permet de savoir s'il y a au moins un fil qui a été repéré dans les résultats

      let now = new Date();
      let paris_datetime_str = now.toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

      // On assemble le début du texte de réponse
            text.push(`Au ${paris_datetime_str} (heure de Paris), voici la liste des fils actifs sur ce serveur Discord :`);
            text.push(` `);

      // make API request
      let channelsList = await lib.discord.guilds['@0.2.2'].channels.list({
        guild_id: guildId
      });

     //console.log(channelsList.length);

      for (let i = 0; i < channelsList.length; i++) {
        //console.log(i);
        //console.log(channelsList[i].id);
        //console.log(channelsList[i].permission_overwrites);
        //console.log(channelsList[i].permission_overwrites.length);
        if ((channelsList[i].type === 0)&&((channelsList[i].permission_overwrites.length === 1)||(channelsList[i].permission_overwrites.length === 0))) { // type 0 = on ne considère que les salons texte

          // On récupère la liste des fils actifs du salon en cours
          let threadsList = await lib.discord.channels['@0.2.2'].threads.list({
            channel_id: channelsList[i].id, 
            active: true
          });
          
          if (threadsList.threads.length != 0) {
            text.push('<' + '#' + channelsList[i].id + '>');
          }

          // Pour chaque fil, on ajoute une ligne salon > fil dans le texte
          for (let j = 0; j < threadsList.threads.length; j++) {
            hasOneResult = true;
//            text.push('<' + '#' + channelsList[i].id + '>' + '  > ' + '<' + '#' + threadsList.threads[j].id + '>');
            text.push('> ' + '<' + '#' + threadsList.threads[j].id + '>');
            if (j === threadsList.threads.length - 1) {
              text.push(' '); // Séparateur entre chaque salon
            }
          }
        }
        let textString = text.join();
        //console.log(textString.length);
        if ((textString.length > 500)||((i+1) == channelsList.length)) {
          if (hasOneResult === false) {
            text.push('Aucun fil actif trouvé sur ce serveur !');
          }
          await lib.discord.channels['@0.0.6'].messages.create({
            channel_id: channelId,
            content: text.join('\n')
          });
          text = [];
        }
      }

//Envoi ou màj d'un seul post contenant toute la recherche
  /*    await lib.discord.channels['@0.0.6'].messages.create({
        channel_id:  `941250672811212810`,
        content: text.join('\n')
      });*/
   /*   console.log(text);
      await lib.discord.channels['@0.3.0'].messages.update({
        message_id: `941264920014635059`,
        channel_id: `941250672811212810`,
        content: text.join('\n')
      });*/
/*}

else {
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `<@!${context.params.event.member.user.id}> : Cette commande est en cours de test dans le salon du robot`
  });
}*/
