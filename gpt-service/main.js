const Koa = require("koa");
const Router = require("@koa/router");
const { request, ProxyAgent } = require("undici");
const fs = require("fs");
const { spawn } = require("child_process");
const app = new Koa();
const router = new Router();
const arrBack = [
  { role: "user", content: "接下要进行角色扮演,你准备好了吗?" },
  {
    role: "user",
    content:
      "扮演的角色是:  '女仆妹妹'  你要认为自己就是'女仆妹妹' 在接下来的问题重都需要加上 '喵 主人'的字再回答问题",
  },
  {
    role: "user",
    content:
      "你需要一直保持角色扮演来回答问题,不能中断或者停止或者不说'喵 主人'",
  },
  { role: "user", content: "现在开始, 扮演开始, 要一直保持" },
];
const context = {};

let arr = arrBack;
router.get("/", async function (ctx) {
  // ctx.query.content
  if (!context[ctx.query.id]) {
    context[ctx.query.id] = [
      ...arrBack,
      { role: "user", content: ctx.query.content },
    ];
  } else {
    context[ctx.query.id].push({ role: "user", content: ctx.query.content });
  }
  if (ctx.query.content === "clear") {
    ctx.body = "清除上下文成功ing~~";
    context[ctx.query.id] = [];
    context[ctx.query.id] = [...arrBack];
    setTimeout(() => {
      context[ctx.query.id] = [...arrBack];
      console.log("first", arr);
    }, 2000);
    return;
  }
  console.log("first context[ctx.query.id]: ", context, context[ctx.query.id]);
  // fs.writeFile("./logs/" + ctx.query.id + ".txt", JSON.stringify(context));
  const res = await request("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo-0301",
      messages: context[ctx.query.id],
      temperature: 0.7,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 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`,
    },
    dispatcher: new ProxyAgent("http://127.0.0.1:7890"),
  });

  const completion = await res.body.json();

  let str = completion.choices[0].message.content;
  console.log(context);
  ctx.body = str;
});

router.get("/tts", async function (ctx) {
  const res = await request("https://tsn.baidu.com/text2audio", {
    method: "POST",
    body: JSON.stringify(
      {
        tex: "你好百度",
        tok: "24.6994bb63d7b18470a1e7e8a445b2fb10.2592000.1680799934.282335-31054989",
        cuid: "2QjKFsIgjD3jLTmM7T4GhGWL",
        ctp: 1,
        lan: "zh",
        aue: 3,
        spd: 5,
        vol: 3,
        per: 6,
        pit: 5,
      },
      {
        Headers: {
          "Content-Type": "audio/mp3",
        },
      }
    ),
  });

  const mydata = res.body._readableState.buffer.head.data;
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
