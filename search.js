// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});


if (context.params.event.data.options[0].name === "thread") {
  let search = context.params.event.data.options[0].options[0].value;
  let searchLowerCase = search.toLowerCase();
  let searchLowerCase_keywords = searchLowerCase.split(' ');
  let result = await lib.googlesheets.query['@0.3.0'].select({
          range: `thread_list!A:D`,
          bounds: 'FIRST_EMPTY_ROW',
          where: [
            {
            'thread_name_search__contains' : `${searchLowerCase_keywords[0]}`
            }
          ],
          limit: {
            'count': 0,
            'offset': 0
          },
    });
  
    //refining search
    if (searchLowerCase_keywords.length > 0) {
      for (let i = 1; i < searchLowerCase_keywords.length; i++) {
        for (let j = 0; j < result.rows.length; j++) {
          if (result.rows[j].fields.thread_name_search.includes(searchLowerCase_keywords[i])) {
  //          newresult.push(result.rows[j]);
          }
          else {
            result.rows.splice(j,1);
            j=-1;
          }
        }
      }
    }
    //end of refining search  
  
    if (result.rows[0] == null) {
          await lib.discord.channels['@0.0.6'].messages.create({
            channel_id: "1001036859952070667",
            content: `<@!${context.params.event.member.user.id}> désolé, pas de résultat pour "${search}". A vous de créer ce fil ;)`
          });
    } 
    else if (result.rows.length > 19) {
      await lib.discord.channels['@0.0.6'].messages.create({
        channel_id: "1001036859952070667",
        content: `<@!${context.params.event.member.user.id}> trop de résultats de fils ou salons pour "${search}", veuillez affiner votre recherche, merci.`
      });
    }
    else {
        let recherche = [];
        let channel;
        for (let i = 0; i < result.rows.length; i++) {
            channel = await lib.discord.channels['@0.3.0'].retrieve({
              channel_id: `${result.rows[i].fields.channel_id}`
            });
            recherche.push(`${channel.name} > [#${result.rows[i].fields.thread_name}](https://discord.com/channels/342731229315072000/${result.rows[i].fields.thread_id})`);
        } 
        recherche = recherche.join("\n");
        await lib.discord.channels['@0.3.0'].messages.create({
              channel_id: "1001036859952070667",
              content: `<@!${context.params.event.member.user.id}> vous trouverez "${search}" dans: `,
              tts: false,
              embeds: [
                {
                  "type": "rich",
                  "title": "",
                  "description": `\n${recherche}`,
                  "color": 15548997
                }
              ]
        });
    }
}
else if (context.params.event.data.options[0].name === "review") {

  let game = context.params.event.data.options[0].options[0].value;
  let keyword = game.toLowerCase();
  let keywords = keyword.split(' ');
  let result = await lib.googlesheets.query['@0.3.0'].select({
          range: `all_reviews!A:I`,
          bounds: 'FIRST_EMPTY_ROW',
          where: [
            {
            'lowercasetitre__contains' : `${keywords[0]}`
            }
          ],
          limit: {
            'count': 0,
            'offset': 0
          },
    });
  
    //refining search
    if (keywords.length > 0) {
      for (let i = 1; i < keywords.length; i++) {
        for (let j = 0; j < result.rows.length; j++) {
          if (result.rows[j].fields.lowercasetitre.includes(keywords[i])) {
  //          newresult.push(result.rows[j]);
          }
          else {
            result.rows.splice(j,1);
            j=-1;
          }
        }
      }
    }
    //end of refining search  
  
    if (result.rows[0] == null) {
          await lib.discord.channels['@0.0.6'].messages.create({
            channel_id: "1001036859952070667",
            content: `<@!${context.params.event.member.user.id}> désolé, pas d'article trouvé pour "${game}".`
          });
    } 
    else if (result.rows.length > 8) {
      await lib.discord.channels['@0.0.6'].messages.create({
        channel_id: "1001036859952070667",
        content: `<@!${context.params.event.member.user.id}> trop de résultats d'articles pour "${game}", veuillez affiner votre recherche, merci.`
      });
    }
    else {
        let recherche = [];
        let urlReview;
        for (let i = 0; i < result.rows.length; i++) {
            recherche.push(`\n${result.rows[i].fields.Titre}`);
            recherche.push(` sur ${result.rows[i].fields.Machine}`); 
            recherche.push(` dans un article du ${result.rows[i].fields.revue} n°${result.rows[i].fields.Numero}`); 
            recherche.push(` en ${result.rows[i].fields.Dates}`);
            if (`${result.rows[i].fields.revue}` == "Gen4") {
              urlReview = encodeURI(result.rows[i].fields.Lien); 
            }
            else {
              urlReview = result.rows[i].fields.Lien;
            }
            recherche.push(` ${urlReview}\n`);
        } 
        recherche = recherche.join("\n");
        
        await lib.discord.channels['@0.0.6'].messages.create({
              channel_id: "1001036859952070667",
              content: [
              `<@!${context.params.event.member.user.id}> vous trouverez "${game}" dans:`,
              `${recherche}`,
              '___'
              ].join('\n')
        });
    }
}

else if (context.params.event.data.options[0].name === "episode") {
  
  let search = context.params.event.data.options[0].options[0].value;
  let keyword = search.toLowerCase();
  
  let result = await lib.googlesheets.query['@0.3.0'].select({
        range: `episodes!A:J`,
        bounds: 'FIRST_EMPTY_ROW',
        where: [
          {
          'themesminor__contains' : `${keyword}`
                    }
        ],
        limit: {
          'count': 0,
          'offset': 0
        },
  });
  
  if (result.rows[0] == null) {
        await lib.discord.channels['@0.0.6'].messages.create({
          channel_id: "1001036859952070667",
          content: `<@!${context.params.event.member.user.id}> désolé, pas d'épisode de SoJ trouvé pour "${search}".`
        });
  } 
  else if (result.rows.length > 9) {
    await lib.discord.channels['@0.0.6'].messages.create({
      channel_id: "1001036859952070667",
      content: `@${context.params.event.member.user.username} trop de résultats d'épisodes de SoJ pour "${search}", veuillez affiner votre recherche, merci.`
    });
  }
  else {
      let recherche = [];
      for (let i = 0; i < result.rows.length; i++) {
              recherche.push(`\n${result.rows[i].fields.themes}`); 
              recherche.push(` ${result.rows[i].fields.date}`);  
              recherche.push(` ${result.rows[i].fields.weburl}`);
              //recherche.push(`Ep.: ${result.rows[i].fields.episode}`);
      } 
      recherche = recherche.join("\n");

      await lib.discord.channels['@0.0.6'].messages.create({
            channel_id: "1001036859952070667",
            content: [
            `<@!${context.params.event.member.user.id}> vous trouverez "${search}" dans:`,
            `${recherche}`,
            '___'
            ].join('\n')
      });
        
  }
}

else {
  
}
