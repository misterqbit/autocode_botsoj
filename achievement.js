const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const jimp = require('jimp');

let text = context.params.event.data.options[0].value.toString();
const maxlength1 = 17;
const maxlength2 = 37;

console.log(text);
if (text.length > maxlength2) {
    text = text.substring(0,maxlength2);
    text = text.concat('...');
    var font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
}
else if ((text.length <= maxlength2)&&(text.length > maxlength1)) {
    var font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
}
else {
    var font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
}

let img = await jimp.read(
    'https://media.discordapp.net/attachments/642122837448065054/1026088395224666182/toppng.com-xbox-achievement-unlocked-png-xbox-360-471x87.png'
);

img.print(font, 105, 50, `${text}`);

let buffer = await img.getBufferAsync(jimp.MIME_PNG);

await lib.discord.channels['@0.1.1'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `Par <@!${context.params.event.member.user.id}> :`,
    filename: 'soj_achievement.png',
    file: buffer,
});
