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

async function SendMessage(type) {
  let content;
  if (type == 'NoDeal') {
    content = "Tu n'es pas autorisé à me donner cet ordre.";
  } else if (type == 'Start') {
    content = 'Mise à jour en cours.';
  } else if (type == 'Finish') {
    content = 'Ca y est, ce canal est considéré comme un test !';
  }
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: channel_id,
    content: content,
  });
}

// Check if user can perform this action
eligible_roles = [
  '936641846719967263', // Modération on server: Yaourt's bot
  '902501987415900170', // Modération on server: Silence on joue !
  '902502594998595585', // Chroniqueureuses on server: Silence on joue !
];
user_roles = context.params.event.member.roles;
not_allowed = true;
if (user_roles.length > 0) {
  for (role of user_roles) {
    if (eligible_roles.includes(role)) {
      not_allowed = false;
    }
  }
}

if (not_allowed) {
  await SendMessage('NoDeal');
  return 0;
}

// Let's begin!
await SendMessage('Start');

// Range names
channel_range = 'channel';

// Get channel table and check if channel is test
channel_array = await GetSheetData(channel_range);
if (
  channel_array.length == 0 ||
  !channel_array.some((channel) => channel.channel_id == channel_id)
) {
  channel_array.push({
    channel_id: channel_id,
    channel_name: channel_name,
    is_test: 1,
    test_last_message_id: 0,
  });
}
channel_array = channel_array.map((channel) => {
  if (channel.channel_id == channel_id) {
    return {...channel, is_test: 1};
  }
  return channel;
});

// Clear all sheets on Google sheet
await CleanSheet(channel_range);

// Insert new data
await InsertInSheet(channel_range, channel_array);

// End of process message
await SendMessage('Finish');

// Success code
return 1;
