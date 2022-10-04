const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const jimp = require('jimp');

let text = context.params.event.data.options[0].value.toString();
let font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);

const maxlength1 = 37;
const maxlength2 = 74;


let img = await jimp.read(
    'https://media.discordapp.net/attachments/1026168814712406037/1026168900473344020/toppng.com-xbox-achievement-unlocked-png-xbox-360-471x87.png'
);

console.log(text);
if (text.length > maxlength2) {
    let text1 = text.substring(0,maxlength1);
    text1 = text1.substr(0,Math.min(maxlength1, text1.lastIndexOf(" ")));
    if (text1.length == 0) {
      text1 = text.substring(0,maxlength1);
    }
    let text2 = text.substring(text1.length,maxlength2);
    text2 = text2.substring(0,maxlength1);
    text2 = text2.concat('...');
    img.print(font, 105, 40, `${text1}`);
    img.print(font, 105, 60, `${text2}`);
}

else if ((text.length > maxlength1)&&(text.length <= maxlength2)) {
    let text1 = text.substring(0,maxlength1);
    text1 = text1.substr(0,Math.min(maxlength1, text1.lastIndexOf(" ")));
    if (text1.length == 0) {
        text1 = text.substring(0,maxlength1);
    }
    let text2 = text.substring(text1.length,maxlength2);

    if (text2.length > maxlength1) {
      text2 = text2.substring(0,maxlength1);
      text2 = text2.concat('...');
    }
    img.print(font, 105, 40, `${text1}`);
    img.print(font, 105, 60, `${text2}`);
}

else {
    img.print(font, 105, 50, `${text}`);
}

let buffer = await img.getBufferAsync(jimp.MIME_PNG);

await lib.discord.channels['@0.1.1'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `Par <@!${context.params.event.member.user.id}> :`,
    filename: 'soj_achievement.png',
    file: buffer,
});
