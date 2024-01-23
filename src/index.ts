import { Context, Schema } from 'koishi'
import suangua from './guaxiang'

export const name = 'mai-suangua'

export interface Config {
  MD模板id: string
  key1: string
  key2: string
}

export const Config: Schema<Config> = Schema.object({
  MD模板id: Schema.string().required(),
  key1: Schema.string().default('text1').description('卦象'),
  key2: Schema.string().default('text2').description('爻辞'),
}).required()

export function apply(ctx: Context, config: Config) {
  ctx.command('算一卦 [arg:text]', '算卦').action(async ({ session },arg) => {
    const {platform}=session
    if(!arg){
      arg=''
    }
    const gua:number=mathRandomInt(1,65)
    let a:string
    let b:string
    switch (gua) {
      case 1:
        a = `\r你心中所念${arg}\r卦象如下:☯︎`
        b = `第0卦,算卦不算命，求人不如求己`
        break;
      default:
        a=`\r你心中所念${arg}\r卦象如下:${suangua.guaxiang[gua-1]}`
        b=suangua.yaoci[gua-1]
    }
    if(platform!=="qq") return a+b
    await session.bot.internal.sendMessage(session.channelId, data(a,b,session))
  })
  function mathRandomInt(a:number, b:number) {
    if (a > b) {
        let c:number = a
        a = b
        b = c
    }
    return Math.floor(Math.random() * (b - a + 1) + a)
}
function data(a,b,c){
  return {
    content: "111",
    msg_type: 2,
    markdown: {
      custom_template_id:config.MD模板id,
      params: [
        {
          key:config.key1,
          values: [`<@${c.userId}>`+a]
        },
        {
          key:config.key2,
          values: [`\r\r> ${b}`]
        }
      ]
    },
    keyboard: {
      content: {
        rows: [
          {
            "buttons": [
              {
                "id": "1",
                "render_data": {
                  "label": "🖊每日签到",
                  "visited_label": "签到"
                },
                "action": {
                  "type": 2,
                  "permission": {
                    "type": 2
                  },
                  "unsupport_tips": "兼容文本",
                  "data": '/签到',
                  "enter": true
                },
              }, {
                "id": "2",
                "render_data": {
                  "label": "☯︎再算一卦",
                  "visited_label": "☯︎再算一卦"
                },
                "action": {
                  "type": 2,
                  "permission": {
                    "type": 2
                  },
                  "unsupport_tips": "兼容文本",
                  "data": "/算一卦",
                  "enter": true
                },
              }]
          }
        ]
      }
    },
    msg_id:c.messageId,
    timestamp: c.timestamp,
    msg_seq: Math.floor(Math.random()*500)
  }
}
}
