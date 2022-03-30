// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const gameListSize = 1091;

if (context.params.event.channel_id == '944567098502438932') {

      let sheet = "games_list";

      function getRandomInt(min, max) {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      let sojID;


      //Processing the entry
      let guess = context.params.event.data.options[0].value;

      // Normalize and remove anything that's not a letter, a space or a digit
      let normalizedGuess = guess.normalize("NFD").replace(/[^a-zA-Z0-9 ]/g, "");

      // Switch everything to lowercase
      let lowercaseGuess = normalizedGuess.toLowerCase();

      // Change the guess into emojis
      let text = [];
      text.push('> ');
      for (i = 0; i < lowercaseGuess.length; i++) {
        // Spaces
        if (lowercaseGuess.charAt(i) === ' ') {
          text.push(':blue_square:');
        }
        // Letters
        else if (lowercaseGuess.charAt(i).match(/[a-z]/g) !== null) {
          text.push(':regional_indicator_' + lowercaseGuess.charAt(i) + ':');
        }
        // Digits : no test needed - if not a space or a letter, it must be a digit. If you want to add a test, use : if (lowercaseGuess.charAt(i).match(/[0-9]/g) !== null)
        else {
          switch (lowercaseGuess.charAt(i)) {
            case '0':
              text.push(':zero:');
              break;
            case '1':
              text.push(':one:');
              break;
            case '2':
              text.push(':two:');
              break;
            case '3':
              text.push(':three:');
              break;
            case '4':
              text.push(':four:');
              break;
            case '5':
              text.push(':five:');
              break;
            case '6':
              text.push(':six:');
              break;
            case '7':
              text.push(':seven:');
              break;
            case '8':
              text.push(':eight:');
              break;
            case '9':
              text.push(':nine:');
              break;
          }
        }
      }
      text.push('\n');

      //Check if we look for a new guess or for the same
      let check = await lib.googlesheets.query['@0.3.0'].select({
        range: `${sheet}!E:H`,
        bounds: 'FIRST_EMPTY_ROW',
        where: [
          {
            'check': 'sojID'
          }
        ],
        limit: {
          'count': 0,
          'offset': 0
        },
      });
      let intentsNbr = parseInt(check.rows[0].fields.intents) + 1;
      let gamesNbr = parseInt(check.rows[0].fields.game) + 1;

      if (lowercaseGuess === 'new') {
        sojID = getRandomInt(1,gameListSize);
        await lib.googlesheets.query['@0.3.0'].update({
            range: `${sheet}!E:H`,
            bounds: 'FIRST_EMPTY_ROW',
            where: [
                    {
                      'check__is': 'sojID'
                    }
                  ],
            fields: {
                'activeround': `${sojID}`,
                'intents' : 0,
                'game' : gamesNbr
            },
        });
      }
      else if (check.rows[0].fields.activeround != 'empty') {
        sojID = check.rows[0].fields.activeround;
        await lib.googlesheets.query['@0.3.0'].update({
            range: `${sheet}!E:H`,
            bounds: 'FIRST_EMPTY_ROW',
            where: [
                    {
                      'check__is': 'sojID'
                    }
                  ],
            fields: {
                'intents': intentsNbr
            },
        });
      }
      else {
        sojID = getRandomInt(1,gameListSize);
        await lib.googlesheets.query['@0.3.0'].update({
            range: `${sheet}!E:H`,
            bounds: 'FIRST_EMPTY_ROW',
            where: [
                    {
                      'check__is': 'sojID'
                    }
                  ],
            fields: {
                'activeround': `${sojID}`,
                'intents': 0,
                'game' : gamesNbr
            },
        });
      }

      //Get the word to be guessed
      let result = await lib.googlesheets.query['@0.3.0'].select({
        range: `${sheet}!A:C`,
        bounds: 'FIRST_EMPTY_ROW',
        where: [
          {
            'id': `${sojID}`
          }
        ],
        limit: {
          'count': 0,
          'offset': 0
        },
      });

      //Prepare the answer
      text.push('> ');
      let orangeFlag;
      let stringLength = result.rows[0].fields.games.length;
      let answer = result.rows[0].fields.games;

//Les lettres bien placees sont enlevees de answer, pour ne pas les compter comme Orange par la suite
      for (i=0; i<stringLength; i++) {
        if (lowercaseGuess.charAt(i) === result.rows[0].fields.games.charAt(i)) {
          answer = answer.replace(`${lowercaseGuess.charAt(i)}`,'');
        }
      }
      
// Construction de la reponse
      for (i=0; i<stringLength; i++) {
          if(result.rows[0].fields.games.charAt(i) === ' ') {
              text.push(':blue_square:');
          }
          else {
            if (lowercaseGuess.charAt(i) === ' ') {
              text.push(':x:');
            }
            else {
                if (lowercaseGuess.charAt(i) === result.rows[0].fields.games.charAt(i)) {
                    text.push(':green_square:');
                }
                else {
                  orangeFlag = 0;
                  for (j=0;j<stringLength;j++) {
                    if (lowercaseGuess.charAt(i) === result.rows[0].fields.games.charAt(j)) {
                      if (answer.includes(lowercaseGuess.charAt(i))) {
                        text.push(':orange_square:');
                        answer = answer.replace(`${lowercaseGuess.charAt(i)}`,'');
                        j = stringLength;
                        orangeFlag = 1;
                      }
                      else {
                        text.push(':x:');
                        j = stringLength;
                        orangeFlag = 1;
                      }
                    }
                  }
                  if (orangeFlag == 0) {
                    if (lowercaseGuess.charAt(i) === '') {
                      text.push(':grey_question:');
                    }
                    else {
                      text.push(':x:');
                    }
                  }
                  else {}
                }
            }
          }
      }

      let reward = ' ';
      if (lowercaseGuess === result.rows[0].fields.games) {
        let playedNbr = parseInt(result.rows[0].fields.played) + 1;
        await lib.googlesheets.query['@0.3.0'].update({
            range: `${sheet}!A:C`,
            bounds: 'FIRST_EMPTY_ROW',
            where: [
                    {
                      'id__is': `${sojID}`
                    }
                  ],
            fields: {
                'played': playedNbr
            },
        });
        if (intentsNbr == 1) {
          reward = ` SOJDLE #${check.rows[0].fields.game} résolu au ${intentsNbr}er essai!! Wow!`;
          await lib.googlesheets.query['@0.3.0'].insert({
            range: `users_scoring!B:D`,
            fieldsets: [
              {
                'players': `${context.params.event.member.user.username}`,
                'points' : 10,
                'games' : `SOJDLE #${check.rows[0].fields.game}`
              }
            ]
          });
        }
        else {
          reward = ` SOJDLE #${check.rows[0].fields.game} résolu au ${intentsNbr}e essai. Bravo!`;
          let points = 10;
          if(intentsNbr > 9) {
            points = 0;
          }
          else {
            points -= intentsNbr;
          }
          await lib.googlesheets.query['@0.3.0'].insert({
            range: `users_scoring!B:D`,
            fieldsets: [
              {
                'players': `${context.params.event.member.user.username}`,
                'points' : points,
                'games' : `SOJDLE #${check.rows[0].fields.game}`
              }
            ]
          });
        }
        sojID = getRandomInt(1,gameListSize);
        
        var newResult = await lib.googlesheets.query['@0.3.0'].select({
                  range: `${sheet}!A:C`,
                  bounds: 'FIRST_EMPTY_ROW',
                  where: [
                    {
                      'id': `${sojID}`
                    }
                  ],
                  limit: {
                    'count': 0,
                    'offset': 0
                  },
                });
        if (newResult.rows[0].fields.played != 0) {
          sojID = getRandomInt(1,gameListSize);
          newResult = await lib.googlesheets.query['@0.3.0'].select({
                    range: `${sheet}!A:C`,
                    bounds: 'FIRST_EMPTY_ROW',
                    where: [
                      {
                        'id': `${sojID}`
                      }
                    ],
                    limit: {
                      'count': 0,
                      'offset': 0
                    },
          });
        }
        if (newResult.rows[0].fields.played != 0) {
          sojID = getRandomInt(1,gameListSize);
          newResult = await lib.googlesheets.query['@0.3.0'].select({
                    range: `${sheet}!A:C`,
                    bounds: 'FIRST_EMPTY_ROW',
                    where: [
                      {
                        'id': `${sojID}`
                      }
                    ],
                    limit: {
                      'count': 0,
                      'offset': 0
                    },
          });
        }
      }
      else {}

      await lib.discord.channels['@0.2.2'].messages.create({
        channel_id: `${context.params.event.channel_id}`,
        content: `<@!${context.params.event.member.user.id}> :` + reward + '\n' + text.join(' ')
      });

      //Print the new word to guess
      if (lowercaseGuess === result.rows[0].fields.games) {

        await lib.googlesheets.query['@0.3.0'].update({
            range: `${sheet}!E:H`,
            bounds: 'FIRST_EMPTY_ROW',
            where: [
                    {
                      'check__is': 'sojID'
                    }
                  ],
            fields: {
                'activeround': `${sojID}`,
                'intents' : 0,
                'game' : gamesNbr
            },
        });

        let newText = [];

        //New text begins with:
        // Spaces
        if (newResult.rows[0].fields.games.charAt(0) === ' ') {
          newText.push(':blue_square:');
        }
        // Letters
        else if (newResult.rows[0].fields.games.charAt(0).match(/[a-z]/g) !== null) {
          newText.push(':regional_indicator_' + newResult.rows[0].fields.games.charAt(0) + ':');
        }
        // Digits : no test needed - if not a space or a letter, it must be a digit. If you want to add a test, use : if (lowercaseGuess.charAt(i).match(/[0-9]/g) !== null)
        else {
          switch (newResult.rows[0].fields.games.charAt(0)) {
            case '0':
              newText.push(':zero:');
              break;
            case '1':
              newText.push(':one:');
              break;
            case '2':
              newText.push(':two:');
              break;
            case '3':
              newText.push(':three:');
              break;
            case '4':
              newText.push(':four:');
              break;
            case '5':
              newText.push(':five:');
              break;
            case '6':
              newText.push(':six:');
              break;
            case '7':
              newText.push(':seven:');
              break;
            case '8':
              newText.push(':eight:');
              break;
            case '9':
              newText.push(':nine:');
              break;
          }
        }

        for (i=1; i<newResult.rows[0].fields.games.length; i++) {
            if(newResult.rows[0].fields.games.charAt(i) === ' ') {
                newText.push(':blue_square:');
            }
            else {
                newText.push(':grey_question:');
            }
        }
        await lib.discord.channels['@0.2.2'].messages.create({
          channel_id: `${context.params.event.channel_id}`,
          content: [ 
            `SOJDLE #${gamesNbr}`,
            newText.join(' '),
            ' '
          ].join('\n')
        });
      }
}
else {
  let result = await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `<@!${context.params.event.member.user.id}> : Cette commande n'est permise que dans le fil #SOJDLE : https://discord.com/channels/342731229315072000/944567098502438932`
  });
}
