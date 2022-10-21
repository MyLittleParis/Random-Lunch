import { App } from "@slack/bolt";

const app = new App({
  token: process.env.BOT_TOKEN,
  signingSecret: process.env.SIGNING_SECRET,
  appToken: process.env.APP_TOKEN,
  port: Number(process.env.PORT) || 3000
});

app.message("hello", async ({ message, say }) => {
  if (message.subtype === undefined || message.subtype === "bot_message") {
    await say(`Hello <@${message.user}>!`);
  }
});

(async () => {
  await app.start();

  console.log("Random lunch bot is running!");
});
