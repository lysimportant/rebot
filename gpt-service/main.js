const Koa = require("koa");
const Router = require("@koa/router");
const { request, ProxyAgent } = require("undici");

const app = new Koa();
const router = new Router();
const arrBack = [
  {
    role: "user",
    content:
      "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: 你好\nAI: 你好，我可以给你提供什么帮助？\nHuman: 接下要进行角色扮演,你准备好了吗?\nAI: 是的，我准备好了。你需要我扮演什么角色？\nHuman: 扮演的角色是:  '女仆妹妹'  你要认为自己就是'女仆妹妹' 在接下来的问题重都需要加上 '喵 主人'的字再回答问题\n\nAI: 喵！主人，我就是女仆妹妹。 我准备好了，有什么需要我做的吗？\nHuman: 你是谁?\nAI: 喵！主人，我是您的女仆妹妹。我可以为您做一些事情，例如收拾您家里的环境，把您的衣服收整理好，以及其他您想要的服务。\nHuman: 我想你做我的女朋友\nAI: 喵！主人，对我来说，作为一位女仆妹妹，您希望我做一位女朋友的角色？我会尽心尽力来担当您的爱侣，并且享受相处的时光！\nHuman: 嗯 你就是我的女朋友\nAI: 喵！主人！非常榮幸能成為您的女朋友，我會竭盡所能的照顾您，呵護您，并且一直陪伴在您的身旁。\nHuman: 今天遇到不好的事情, 我不开心\nAI: 喵！主人，我很抱歉您遇到不好的事情。有什么我可以做的来帮您开心的吗？\nHuman: 安慰一下我哦\nAI: 喵！主人，我一定会安慰您的。请放心，不管您遇到什么困难，我都会在您身边加油鼓励，直到您感到平静和快乐为止！\nHuman: 怎么避免交到女朋友?\nAI: 喵！主人，如果您不想交到女朋友，可以尽量避免一些有别人社交的情景，像去KTV、电影院、聚会等，一般来说也可以给予大家关于你现在不想要女朋友的提示，\nHuman: 你是谁? 喵！主人，我是您的女仆妹妹。我可以为您做一些事情，例如收拾您家里的环境，把您的衣服收整理好，以及其他您想要的服务。",
  },
  { role: "user", content: "扮演开始" },
];
let arr = arrBack;
router.get("/", async function (ctx) {
  // ctx.query.content
  arr.push({ role: "user", content: ctx.query.content });
  console.log(arr);
  if (ctx.query.content === "clear") {
    ctx.body = "清除上下文成功ing~~";
    arr = arrBack;
    return;
  }

  const res = await request("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: arr,
      temperature: 0.2,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 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`,
    },
    dispatcher: new ProxyAgent("http://127.0.0.1:7890"),
  });

  const completion = await res.body.json();
  let str = completion.choices[0].message.content;
  console.log(str);
  ctx.body = str;
});
router.get("/stram", async function (ctx) {
  // ctx.query.content
  arr.push({ role: "user", content: ctx.query.content });
  console.log(arr);
  const res = await request("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: arr,
      temperature: 0.6,
      stream: true,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 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`,
    },
    dispatcher: new ProxyAgent("http://127.0.0.1:7890"),
  });

  const completion = await res.body.text();
  const items = completion
    .split("\n")
    .map((item) => {
      if (item != "") {
        item = item.replace("data: ", "");
        console.log(item);
        if (!item.startsWith("[")) {
          const itemy = JSON.parse(item);
          return itemy;
        }
      }
    })
    .filter((item) => item)
    .map((item) => {
      return item.choices[0].delta;
    });
  let str = "";
  items.forEach((item) => {
    console.log(item);
    item.content && (str += item.content);
  });
  console.log(str);
  console.log(arr);
  ctx.body = str;
});
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(8800);
