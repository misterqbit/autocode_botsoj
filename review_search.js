// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let game = context.params.event.data.options[0].options[0].value;
let magazine = context.params.event.data.options[0].name;

let keyword = game.toLowerCase();
let keywords = keyword.split(' ');

if (magazine == 'tilt'){
  let result = await lib.googlesheets.query['@0.3.0'].select({
        range: `cateltilt!A:J`,
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
  console.log(keywords);
  console.log(result.rows.length);

  //refining search
  if (keywords.length > 0) {
    for (let i = 1; i < keywords.length; i++) {
      for (let j = 0; j < result.rows.length; j++) {
        if (result.rows[j].fields.lowercasetitre.includes(keywords[i])) {
//          newresult.push(result.rows[j]);
          console.log(j);
          console.log('A');
          console.log(result.rows);
        }
        else {
          console.log(result.rows);
          result.rows.splice(j,1);
          console.log(`spliced`);
          console.log(result.rows);
          j=-1;
        }
      }
    }
  }
  //end of refining search  

  if (result.rows[0] == null) {
        await lib.discord.channels['@0.0.6'].messages.create({
          channel_id: context.params.event.channel_id,
          content: `@${context.params.event.member.user.username} : désolé, pas de résultat pour "${game}" dans Tilt.`
        });
  } 
  else if (result.rows.length > 10) {
    await lib.discord.channels['@0.0.6'].messages.create({
      channel_id: context.params.event.channel_id,
      content: `@${context.params.event.member.user.username} : trop de résultats pour "${game}" dans Tilt, veuillez affiner votre recherche, merci.`
    });
  }
  else {
      let recherche = [];
//      let urlTilt;
      for (let i = 0; i < result.rows.length; i++) {
          recherche.push(`\n${result.rows[i].fields.Titre}`);
          recherche.push(` sur ${result.rows[i].fields.Machine}`); 
          recherche.push(` dans un article du Tilt n° ${result.rows[i].fields.Numero}`); 
          recherche.push(` en ${result.rows[i].fields.Dates}`);
//          urlTilt = encodeURI(result.rows[i].fields.Lien); 
//          recherche.push(` ${urlTilt}`);
          recherche.push(` ${result.rows[i].fields.Lien}`); 
      } 
      await lib.discord.channels['@0.0.6'].messages.create({
            channel_id: `${context.params.event.channel_id}`,
            content: [
            `<@!${context.params.event.member.user.id}> : vous trouverez "${game}" dans:`,
            `${recherche}`,
            '___'
            ].join('\n')
      });
  }
}
else {

  let result = await lib.googlesheets.query['@0.3.0'].select({
        range: `catelgen4!A:J`,
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
          channel_id: context.params.event.channel_id,
          content: `@${context.params.event.member.user.username} : désolé, pas de résultat pour "${game}" dans Génération 4.`
        });
  } 
  else if (result.rows.length > 10) {
    await lib.discord.channels['@0.0.6'].messages.create({
      channel_id: context.params.event.channel_id,
      content: `@${context.params.event.member.user.username} : trop de résultats pour "${game}" dans Génération 4, veuillez affiner votre recherche, merci.`
    });
  }
  else {
      let recherche = [];
      let urlGen4;
      for (let i = 0; i < result.rows.length; i++) {
          recherche.push(`\n${result.rows[i].fields.Titre}`);
          recherche.push(` sur ${result.rows[i].fields.Machine}`); 
          recherche.push(` dans un article du Génération 4 n° ${result.rows[i].fields.Numero}`); 
          recherche.push(` en ${result.rows[i].fields.Dates}`);
          urlGen4 = encodeURI(result.rows[i].fields.Lien); 
          recherche.push(` ${urlGen4}`); 
      } 
      await lib.discord.channels['@0.0.6'].messages.create({
            channel_id: `${context.params.event.channel_id}`,
            content: [
            `<@!${context.params.event.member.user.id}> : vous trouverez "${game}" dans:`,
            `${recherche}`,
            '___'
            ].join('\n')
      });
  }
}
