// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// Get channel id and topic info
const channel_id = context.params.event.channel_id;
const topic = await lib.discord.channels['@0.3.0'].retrieve({
  channel_id: channel_id,
});
let channel_name = topic.name;

// Useful functions
async function GetSheetData(range) {
  let sheet_data = await lib.googlesheets.query['@0.3.0'].select({
    range: range,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{}],
    limit: {
      count: 0,
      offset: 0,
    },
  });

  fieldsets = [];
  for (row of sheet_data.rows) {
    fieldsets = fieldsets.concat(row.fields);
  }
  return fieldsets;
}

async function CleanSheet(range) {
  await lib.googlesheets.query['@0.3.0'].delete({
    range: range,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{}],
    limit: {
      count: 0,
      offset: 0,
    },
  });
}

async function InsertInSheet(range, fieldsets) {
  await lib.googlesheets.query['@0.3.0'].insert({
    range: range,
    fieldsets: fieldsets,
  });
}

async function SendMessage(content) {
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: channel_id,
    content: content,
  });
}

//Messages
const exec_none = "Ce canal n'est pas un test, je ne vais donc rien collecter.";
const exec_begin = 'Je commence la collecte, merci de patienter.';
const exec_end = "J'ai fini ma collecte. A bientôt !";

// Range names
const channel_range = 'channel';
const user_range = 'user';
const game_range = 'test_game';
const sample_range = 'test_sample';
const answer_range = 'test_answer';

// Get channel table and check if channel is test
channel_array = await GetSheetData(channel_range);
if (
  channel_array.length == 0 ||
  !channel_array.some((channel) => channel.channel_id == channel_id) ||
  channel_array.filter((channel) => {
    return channel.channel_id == channel_id;
  })[0].is_test != 1
) {
  await SendMessage(exec_none);
  return 0;
}

await SendMessage(exec_begin);
const test_as_text =
  channel_array.filter((channel) => {
    return channel.channel_id == channel_id;
  })[0].test_as_text == 1;

// Get other tables
user_array = await GetSheetData(user_range);
game_array = await GetSheetData(game_range);
sample_array = await GetSheetData(sample_range);
answer_array = await GetSheetData(answer_range);

// Get last message id
let test_last_message_id = '0';
if (
  channel_array.length == 0 ||
  !channel_array.some((channel) => channel.channel_id == channel_id)
) {
  channel_array.push({
    channel_id: channel_id,
    channel_name: channel_name,
    test_last_message_id: test_last_message_id,
  });
} else {
  test_last_message_id = channel_array.filter((channel) => {
    return channel.channel_id == channel_id;
  })[0].test_last_message_id;
}

// Collect messages since last seen
let keep_collecting = true;
let collect_counter = 0;
let collect_loop_limit = 5;
let full_list = [];
while (keep_collecting && collect_counter < collect_loop_limit) {
  collect_counter = collect_counter + 1;
  let message_list = await lib.discord.channels['@0.3.0'].messages.list({
    channel_id: channel_id,
    after: test_last_message_id,
    limit: 100,
  });
  if (message_list.length > 0) {
    test_last_message_id = message_list[0].id;
    message_list = message_list.reverse();
    full_list = full_list.concat(message_list);
  } else {
    keep_collecting = false;
  }
}

// Check if emoji and build short list
let short_list = full_list.filter(function (message) {
  let check_bool = false;
  if (typeof message.reactions != 'undefined') {
    for (const reaction of message.reactions) {
      if (['🟢', '🟠', '🔴'].includes(reaction.emoji.name)) {
        check_bool = true;
      }
    }
  }
  return check_bool;
});

// Check if we have anything more to do
if (short_list.length > 0) {
  // Check if there are complete questions in our short list
  short_list.reverse();
  let break_bool = false;
  test_last_message_id = short_list[0].id;
  let red_seen = false;

  for (const message of short_list) {
    if (break_bool) {
      break;
    }
    if (red_seen) {
      test_last_message_id = message.id;
      break;
    }
    for (const reaction of message.reactions) {
      if (reaction.emoji.name == '🟢') {
        break_bool = true;
        break;
      }
      if (reaction.emoji.name == '🔴') {
        red_seen = true;
      }
    }
  }

  // Update last message seen
  channel_array = channel_array.map((channel) => {
    if (channel.channel_id == channel_id) {
      return {...channel, test_last_message_id: test_last_message_id};
    }
    return channel;
  });

  // Shorten the short list if necessary
  short_list = short_list.filter(function (message) {
    return message.id <= test_last_message_id;
  });
}

let game_id = game_array.length;
let sample_id = sample_array.length;
let last_answer_id = answer_array.length;
let answer_id = last_answer_id;

// If we still have messages in the short list, we need to update the sheet
if (short_list.length > 0) {
  short_list.reverse();

  let new_game;
  let has_samples;
  let check_user;
  let is_answer;

  for (message of short_list) {
    has_samples = false;
    check_user = false;
    new_game = false;
    is_answer = false;

    for (const reaction of message.reactions) {
      // New game
      if (reaction.emoji.name == '🔴') {
        has_samples = true;
        check_user = true;
        new_game = true;
      }

      // Additional samples
      if (reaction.emoji.name == '🟠') {
        has_samples = true;
      }

      // Answer
      if (reaction.emoji.name == '🟢') {
        check_user = true;
        is_answer = true;
      }
    }

    // Create new game row
    if (new_game) {
      game_id = game_id + 1;
      game_array.push({
        game_id: game_id,
        channel_id: channel_id,
        game_master_id: message.author.id,
        game_datetime: message.timestamp,
        first_message_id: message.id,
      });
    }

    // insert answer
    if (is_answer) {
      if (
        answer_array.length == 0 ||
        !answer_array.some((answer) => answer.answer_string == message.content)
      ) {
        answer_id = last_answer_id + 1;
        last_answer_id = answer_id;
        answer_array.push({
          answer_id: answer_id,
          answer_string: message.content,
        });
      } else {
        answer_id = answer_array.filter((answer) => {
          return answer.answer_string == message.content;
        })[0].answer_id;
      }
      // Update game row to add answer
      game_array = game_array.map((game) => {
        if (game.game_id == game_id) {
          return {
            ...game,
            winner_id: message.author.id,
            winning_datetime: message.timestamp,
            answer_id: answer_id,
            answer_message_id: message.id,
          };
        }
        return game;
      });
    }

    // Log sample info for each sample
    if (has_samples && test_as_text){
      sample_id = sample_id + 1;
      sample_array.push({
        sample_id: sample_id,
        game_id: game_id,
        sample_name: message.content
      });
    }
    else if (has_samples && !test_as_text) {
      for (attachment of message.attachments) {
        sample_id = sample_id + 1;
        sample_array.push({
          sample_id: sample_id,
          game_id: game_id,
          sample_name: attachment.filename,
          sample_url: attachment.url,
        });
      }
    }

    // Check user in list
    if (check_user) {
      if (
        user_array.length == 0 ||
        !user_array.some((user) => user.user_id == message.author.id)
      ) {
        user_array.push({
          user_id: message.author.id,
          user_name_discord: message.author.username,
        });
      }
    }
  }
}

// Clear all sheets on Google sheet
await CleanSheet(channel_range);
await CleanSheet(game_range);
await CleanSheet(answer_range);
await CleanSheet(sample_range);
await CleanSheet(user_range);

// Insert new data
await InsertInSheet(channel_range, channel_array);
await InsertInSheet(game_range, game_array);
await InsertInSheet(answer_range, answer_array);
await InsertInSheet(sample_range, sample_array);
await InsertInSheet(user_range, user_array);

// End of process message
await SendMessage(exec_end);

// Success code
return 1;
