// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const gameListSize = 973;

if (context.params.event.channel_id == '944567098502438932') {

      function getRandomInt(min, max) {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      let sojID;

      //Processing the entry to remove numbers, special characters and lowercase it
      let guess = context.params.event.data.options[0].value;
      
      guess = guess.replace(/1/g,"i");
      guess = guess.replace(/2/g,"ii");
      guess = guess.replace(/3/g,"iii");
      guess = guess.replace(/4/g,"iv");
      guess = guess.replace(/5/g,"v");
      guess = guess.replace(/6/g,"vi");
      guess = guess.replace(/7/g,"vii");
      guess = guess.replace(/8/g,"viii");
      guess = guess.replace(/9/g,"ix");

 // Normalize and remove anything that's not a letter, a space or a digit
let normalizedGuess = guess.normalize("NFD").replace(/[^a-zA-Z0-9 ]/g, "");

// Switch everything to lowercase
let lowercaseGuess = normalizedGuess.toLowerCase();

      //Print the first line with our entry converted to emoji letters
      let text = [];
      text.push('> ');
      for (i=0; i<lowercaseGuess.length; i++) {
        if (lowercaseGuess.charAt(i) == ' ') {
          text.push(':blue_square:');
        }
        else {
          text.push(':regional_indicator_' + lowercaseGuess.charAt(i) + ':');
        }
      }
      text.push('\n');


      //Check if we look for a new guess or for the same
      let check = await lib.googlesheets.query['@0.3.0'].select({
        range: `games_list!C:E`,
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

      if (lowercaseGuess === 'new') {
        sojID = getRandomInt(1,gameListSize);
        await lib.googlesheets.query['@0.3.0'].update({
            range: `games_list!C:E`,
            bounds: 'FIRST_EMPTY_ROW',
            where: [
                    {
                      'check__is': 'sojID'
                    }
                  ],
            fields: {
                'activeround': `${sojID}`,
                'intents' : 0
            },
        });
      }
      else if (check.rows[0].fields.activeround != 'empty') {
        sojID = check.rows[0].fields.activeround;
        await lib.googlesheets.query['@0.3.0'].update({
            range: `games_list!C:E`,
            bounds: 'FIRST_EMPTY_ROW',
            where: [
                    {
                      'check__is': 'sojID'
                    }
                  ],
            fields: {
                'activeround': `${sojID}`,
                'intents': intentsNbr
            },
        });
      }
      else {
        sojID = getRandomInt(1,gameListSize);
        await lib.googlesheets.query['@0.3.0'].update({
            range: `games_list!C:E`,
            bounds: 'FIRST_EMPTY_ROW',
            where: [
                    {
                      'check__is': 'sojID'
                    }
                  ],
            fields: {
                'activeround': `${sojID}`,
                'intents': 0
            },
        });
      }

      //Get the word to be guessed
      let result = await lib.googlesheets.query['@0.3.0'].select({
        range: `games_list!A:B`,
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

      //Build the answer
      text.push('> ');
      let orangeFlag;
      let stringLength = result.rows[0].fields.games.length;
      let answer = result.rows[0].fields.games;

      for (i=0; i<stringLength; i++) {
        if (lowercaseGuess.charAt(i) === result.rows[0].fields.games.charAt(i)) {
          answer = answer.replace(`${lowercaseGuess.charAt(i)}`,'');
        }
      }

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
        if (intentsNbr == 1) {
          reward = ` SOJDLE #${sojID} résolu au ${intentsNbr}er essai!! Wow!`;
        }
        else {
          reward = ` SOJDLE #${sojID} résolu au ${intentsNbr}e essai. Bravo!`;
        }
        sojID = getRandomInt(1,gameListSize);
        await lib.googlesheets.query['@0.3.0'].update({
            range: `games_list!C:E`,
            bounds: 'FIRST_EMPTY_ROW',
            where: [
                    {
                      'check__is': 'sojID'
                    }
                  ],
            fields: {
                'activeround': `${sojID}`,
                'intents' : 0
            },
        });
      }
      else {}

      await lib.discord.channels['@0.2.2'].messages.create({
        channel_id: `${context.params.event.channel_id}`,
        content: `<@!${context.params.event.member.user.id}> :` + reward + '\n' + text.join(' ')
      });

      //Print the new word to guess
      if (lowercaseGuess === result.rows[0].fields.games) {
        let newResult = await lib.googlesheets.query['@0.3.0'].select({
          range: `games_list!A:B`,
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

        let newText = [];
        newText.push(':regional_indicator_' + newResult.rows[0].fields.games.charAt(0) + ':');

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
            `SOJDLE #${sojID}`,
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
