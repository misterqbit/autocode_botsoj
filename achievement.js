const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const jimp = require('jimp');

let text = context.params.event.data.options[0].value.toString();
const maxlength = 37;

console.log(text);
if (text.length > maxlength) {
    text = text.substring(0,maxlength);
    text = text.concat('...');
}

let img = await jimp.read(
    'https://media.discordapp.net/attachments/642122837448065054/1026088395224666182/toppng.com-xbox-achievement-unlocked-png-xbox-360-471x87.png'
);

const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
img.print(font, 105, 50, `${text}`);

let buffer = await img.getBufferAsync(jimp.MIME_PNG);

await lib.discord.channels['@0.1.1'].messages.create({
    channel_id: context.params.event.channel_id,
    content: ``,
    filename: 'idcard.png',
    file: buffer,
});
