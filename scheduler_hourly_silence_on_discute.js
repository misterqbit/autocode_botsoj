// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({
    token: process.env.STDLIB_SECRET_TOKEN
});

const channelId = '941250672811212810'; // #discussions-en-cours
const guildId = '342731229315072000'; // Silence on joue !
const emojiDesarchivage = ":up:"; // Emoji utilisé pour un fil récemment désarchivé
const emojiArchivage = ":hourglass:"; // Emoji utilisé pour un fil qui part bientôt en archivage
const emojiNouveau = ":new:"; // Emoji utilisé pour un fil récemment créé

// Fonction de timer
let sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};


// Fonction de suppression
// messageId = ID Discord du message à supprimer
async function deleteMessage(messageId) {
    await lib.discord.channels['@0.0.6'].messages.destroy({
        message_id: messageId,
        channel_id: channelId
    });
}

// On récupère la liste des messages du fil
var messagesList = await lib.discord.channels['@0.0.6'].messages.list({
    channel_id: channelId,
    limit: 50
});

// On boucle sur les messages pour tous les effacer
// Le await permet de ne poursuivre que lorsque la fonction deleteMessage a terminé son traitement
for (message of messagesList) {
    await deleteMessage(message.id);
    await sleep(500);
}

var messageText = []; // recueillera l'assemblage du texte affiché dans un message
var hasOneResult = false; // permet de savoir s'il y a au moins un fil qui a été repéré dans les résultats

var maintenant = new Date();
var paris_datetime_str = maintenant.toLocaleString("fr-FR", {
    timeZone: "Europe/Paris"
});

// On assemble le début du texte de réponse, avec la légende
messageText.push(`Au ${paris_datetime_str} (heure de Paris), voici la liste des fils actifs sur ce serveur Discord.`);
messageText.push(` `);
messageText.push("**__Légende :__**");
messageText.push("> " + emojiNouveau + " = fil créé dans les 3 derniers jours");
messageText.push("> " + emojiDesarchivage + " = fil réactivé dans les dernières 24 heures");
messageText.push("> " + emojiArchivage + " = fil risquant l'archivage dans les 12 heures");
messageText.push(` `);

// On récupère la liste des salons du serveur
var channelsList = await lib.discord.guilds['@0.2.2'].channels.list({
    guild_id: guildId
});


for (var i = 0; i < channelsList.length; i++) {
  
    if ((channelsList[i].type === 0) && ((channelsList[i].permission_overwrites.length === 1) || (channelsList[i].permission_overwrites.length === 0))) { // type 0 = on ne considère que les salons texte

        // On récupère la liste des fils actifs du salon en cours
        let threadsList = await lib.discord.channels['@0.2.2'].threads.list({
            channel_id: channelsList[i].id,
            active: true
        });

        if (threadsList.threads.length !== 0) {
            messageText.push('<#' + channelsList[i].id + '>');
        }

        // Pour chaque fil, on ajoute une ligne indentée dans le texte
        for (let j = 0; j < threadsList.threads.length; j++) {
      let emojisText = "";
      hasOneResult = true; // On indique qu'au moins un fil actif a été trouvé
      
      // --------------------------------- TEST NOUVEAU FIL ---------------------------------
            // On transforme la date/heure d'exécution en un entier l'exprimant en millisecondes écoulées depuis de 1er janvier 1970
            let maintenantNB = maintenant.getTime();
            // les ID discord sont, exprimé en décimal, un binaire de 64 bits, la date de création étant contenue dans les bits 22 à 63, en millisecondes écoulées depuis la première seconde de 2015
            // on divise l'ID par 2^22 pour faire passer les bits 0 à 21 après la virgule et récupérer la date de création, puis on l'ajoute à la date du 1er janvier 2015 (en millisecondes écoulées depuis le 1er janvier 1970)
            let timestampNB = (threadsList.threads[j].id / 4194304) + 1420070400000;
            // on soustrait la date de création à la date actuelle, et on vérifie qu'elle soit inférieure à 3 jours (en millisecondes)
            if ((maintenantNB - timestampNB) < 1000 * 60 * 60 * 24 * 3) {
                emojisText += (" " + emojiNouveau);
            }

      // --------------------------------- TEST FIL EN FIN DE VIE ---------------------------------
            // ajout d'un emoji en cas d'archivage dans les 12h (double-vérification de la date du dernier message, et de la date d'archive)
            let datemessageNB = (threadsList.threads[j].last_message_id / 4194304) + 1420070400000;
            let dateDesarchivageNB = new Date(threadsList.threads[j].thread_metadata.archive_timestamp).getTime();
            if (((maintenantNB - datemessageNB) > 1000 * 60 * 60 * 156) && ((maintenantNB - dateDesarchivageNB) > 1000 * 60 * 60 * 156)) {
                emojisText += (" " + emojiArchivage);
            }
      
      // --------------------------------- TEST FIL DESARCHIVE ---------------------------------
            // ajout d'un emoji en cas de fil désarchivé (on vérifie d'abord que le fil n'est pas nouveau, puis on vérifie la date d'archive)
            if ((!emojisText.includes(emojiNouveau)) && (maintenantNB - dateDesarchivageNB) < 1000 * 60 * 60 * 24) {
                emojisText += (" " + emojiDesarchivage);
            }
/*            // On demande la liste de utilisateurs du fil - pour en compter le nombre
            await sleep(250);
            let thread_members = await lib.discord.channels['@0.2.2'].threads.members.list({
              thread_id: threadsList.threads[j].id
            });*/
            
            // On ajoute la ligne
            messageText.push('> <#' + threadsList.threads[j].id + '>' + emojisText);
            if (j === threadsList.threads.length - 1) {
                messageText.push(' '); // Séparateur entre chaque salon
            }
        }
    }
  
  // On crée une version ininterrompue du texte pour mesurer sa longueur
    let textString = messageText.join();

  // On poste un message si on dépasse 500 caractères ou qu'on arrive au bout de la boucle
    if ((textString.length > 500) || ((i + 1) == channelsList.length)) {
        if (hasOneResult === false) {
            messageText.push('Aucun fil actif trouvé sur ce serveur !');
        }
    if (!messageText.length) {
      }
    else {
      await lib.discord.channels['@0.0.6'].messages.create({
        channel_id: channelId,
        content: messageText.join(' \n')
      });
      messageText = [];
    }       
  }
}
/*messageText.push(` `);
messageText.push("**__Légende :__**");
messageText.push("> " + emojiNouveau + " = fil créé dans les 3 derniers jours");
messageText.push("> " + emojiDesarchivage + " = fil réactivé dans les dernières 24 heures");
messageText.push("> " + emojiArchivage + " = fil risquant l'archivage dans les 12 heures");
messageText.push(` `);

await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: channelId,
  content: messageText.join(' \n')
});*/
