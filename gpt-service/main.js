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
  console.log(ctx.query.content);
  console.log(ctx.query.id);
  if (!ctx.query.content) return;
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

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(8800);
