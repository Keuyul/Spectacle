const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.argv.length == 2 ? process.env.token : "";

client.on('ready', () => {
  console.log('OPEN.');
  client.user.setPresence({ game: { name: 'FBI OPEN UP!' }, status: 'online' })
});

client.on('message', (message) => {
  if(message.author.bot) return;
  
  if(message.content == '-ping') {
    return message.reply('pong');
  }
})

client.on('message', (message) => {
  if(message.author.bot) return;

  if(message.content == '-lol') {
    return message.reply('lol');
  }

  if(message.content == '-spectacle') {
    let img = 'https://i.imgur.com/M226hm8.png';
    let embed = new Discord.RichEmbed()
      .setTitle('Spectacle')
      .setURL('http://www.naver.com')
      .setAuthor('MADE BY KEUYUL', img, 'http://www.naver.com')
      .setThumbnail(img)
      .addBlankField()
      .addField('BOTNAME', 'spectacle')
      .addField('Inline field title', 'Some value here', true)
      .addField('Inline field title', 'Some value here', true)
      .addField('Inline field title', 'Some value here', true)
      .addField('Inline field title', 'Some value here1\nSome value here2\nSome value here3\n')
      .addBlankField()
      .setTimestamp()
      .setFooter('MADE BY KEUYUL', img)

    message.channel.send(embed)
  } else if(message.content == '-help') {
    let helpImg = 'https://i.imgur.com/M226hm8.png';
    let commandList = [
      {name: '-help', desc: '도움말보기'},
      {name: '-spectalce', desc: 'spectacle bot 정보 보기'},
      {name: '-ping', desc: 'pong'},
      {name: '-lol', desc: 'lol'},
      {name: '-전체공지', desc: 'dm으로 전체 embed 형식으로 공지 보내기'},
      {name: '-청소', desc: '텍스트 지움'},
    ];
    let commandStr = '';
    let embed = new Discord.RichEmbed()
      .setAuthor('Help of spectacle BOT', helpImg)
      .setColor('#00ffff')
      .setFooter(`spectacle BOT`)
      .setTimestamp()
    
    commandList.forEach(x => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`;
    });

    embed.addField('Commands: ', commandStr);

    message.channel.send(embed)
  }

  else if(message.content.startsWith('-전체공지')) {
  if(checkPermission(message)) return
  if(message.member != null) { // 채널에서 공지 쓸 때
    let contents = message.content.slice('-전체공지'.length);
    let embed = new Discord.RichEmbed()
      .setAuthor('공지 of spectacle BOT')
      .setColor('#00ffff')
      .setFooter(`MADE BY KEUYUL`)
      .setTimestamp()

    embed.addField('공지: ', contents);

    message.member.guild.members.array().forEach(x => {
      if(x.user.bot) return;
      x.user.send(embed)
    });

    return message.reply('공지를 전송했습니다.');
  } else {
    return message.reply('채널에서 실행해주세요.');
  }

} else if(message.content.startsWith('-청소')) {
  if(message.channel.type == 'dm') {
    return message.reply('dm에서 사용할 수 없는 명령어 입니다.');
  }
  
  if(message.channel.type != 'dm' && checkPermission(message)) return

  var clearLine = message.content.slice('-청소 '.length);
  var isNum = !isNaN(clearLine)

  if(isNum && (clearLine <= 0 || 100 < clearLine)) {
    message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
    return;
  } else if(!isNum) { // c @나긋해 3
    if(message.content.split('<@').length == 2) {
      if(isNaN(message.content.split(' ')[2])) return;

      var user = message.content.split(' ')[1].split('<@!')[1].split('>')[0];
      var count = parseInt(message.content.split(' ')[2])+1;
      let _cnt = 0;

      message.channel.fetchMessages().then(collected => {
        collected.every(msg => {
          if(msg.author.id == user) {
            msg.delete();
            ++_cnt;
          }
          return !(_cnt == count);
        });
      });
    }
  } else {
    message.channel.bulkDelete(parseInt(clearLine)+1)
      .then(() => {
        AutoMsgDelete(message, `<@${message.author.id}> ` + parseInt(clearLine) + "개의 메시지를 삭제했습니다. (이 메세지는 잠시 후에 사라집니다.)");
      })
      .catch(console.error)
  }
}
});

function checkPermission(message) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> ` + "명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
    return true;
  } else {
    return false;
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str;
  limitLen -= tmp.length;

  for(let i=0;i<limitLen;i++) {
      tmp += ' ';
  }

  return tmp;
}

async function AutoMsgDelete(message, str, delay = 3000) {
  let msg = await message.channel.send(str);

  setTimeout(() => {
    msg.delete();
  }, delay);
}


client.login(token);
