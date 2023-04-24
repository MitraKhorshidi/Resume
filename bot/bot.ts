import {
  TelegramBot,
  UpdateType,
} from "https://deno.land/x/telegram_bot_api/mod.ts";

const TOKEN = Deno.env.get("TOKEN");
if (!TOKEN) throw new Error("Bot token is not provided");
const bot = new TelegramBot(TOKEN);

bot.run({
  polling: true,
});

bot.on(UpdateType.Message, async ({ message: requestMessage }) => {
  const command = requestMessage.text;

  if (command === "/start") {
    return await bot.sendMessage({
      chat_id: requestMessage.chat.id,
      text:
        "Hi, I'm Cover Letter Bot, I can generate cover letter for you.\n\nPlease send me the company name and address",
    });
  }

  const commandPart = command?.split("\n");
  if (!commandPart || commandPart.length < 2) {
    return await bot.sendMessage({
      chat_id: requestMessage.chat.id,
      text: "Please enter a valid command",
    });
  }

  const [jobPosition, ...company] = commandPart;
  const companyName = company[0];
  const companyFull = company.join("\n");

  const answer = `
Job Position: ${jobPosition}
Company Name: ${companyName}
Company Full:
${companyFull}
  `;

  console.log("New Cover Letter Request: ", answer);

  const waitMessage = await bot.sendMessage({
    chat_id: requestMessage.chat.id,
    reply_to_message_id: requestMessage.message_id,
    text: `Your cover letter is being generated,\n${answer}`,
  });

  const generateJob = Deno.run({
    cmd: [
      "./bin/coverFor.sh",
      jobPosition,
      companyName,
      companyFull.replaceAll("\n", "\\\\"),
    ],
  });

  const generateStatus = await generateJob.status();

  if (!generateStatus.success) {
    return bot.editMessageText({
      chat_id: waitMessage.chat.id,
      message_id: waitMessage.message_id,
      text: "Something went wrong, please try again later",
    });
  }

  bot.deleteMessage({
    chat_id: waitMessage.chat.id,
    message_id: waitMessage.message_id,
  });

  const file = await Deno.readFile(`./out/Cover-${companyName}.pdf`);
  await bot.sendDocument({
    chat_id: waitMessage.chat.id,
    reply_to_message_id: requestMessage.message_id,
    document: new File([file], `Cover-Mitra-Khorshidi-${companyName}.pdf`),
  });
});
