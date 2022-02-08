// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if (context.params.event.channel_id == '940708499598491689') {


      let text = []; // recueillera l'assemblage du texte affiché dans le message
      let hasOneResult = false; // permet de savoir s'il y a au moins un fil qui a été repéré dans les résultats

      // On assemble le début du texte de réponse
      text.push(`Voici la liste des fils actifs sur ce serveur Discord :`);
      text.push(` `);

      // make API request
      let channelsList = await lib.discord.guilds['@0.2.2'].channels.list({
        guild_id: `342731229315072000`
      });

      //console.log(channels_list);

      for (let i = 0; i < channelsList.length; i++) {
        if (channelsList[i].type === 0) { // type 0 = on ne considère que les salons texte

          // On récupère la liste des fils actifs du salon en cours
          let threadsList = await lib.discord.channels['@0.2.2'].threads.list({
            channel_id: channelsList[i].id, 
            active: true
          });

          // Pour chaque fil, on ajoute une ligne salon > fil dans le texte
          for (let j = 0; j < threadsList.threads.length; j++) {
            hasOneResult = true;
            text.push('<' + '#' + channelsList[i].id + '>' + '  > ' + '<' + '#' + threadsList.threads[j].id + '>');
            if (j === threadsList.threads.length - 1) {
              text.push(' '); // Séparateur entre chaque salon
            }
          }    
        }
      }

      if (hasOneResult === false) {
        text.push('Aucun fil actif trouvé sur ce serveur !');
      }

      await lib.discord.channels['@0.0.6'].messages.create({
        channel_id:  `${context.params.event.channel_id}`,
        content: text.join('\n')
      });
}
else {
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `<@!${context.params.event.member.user.id}> : Cette commande est en cours de test dans le fil <#commande silence_on_discute> du salon du robot`
  });
}
