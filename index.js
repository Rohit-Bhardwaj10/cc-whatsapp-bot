const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const cron = require("node-cron");
const { getLeetCodePOTD } = require("./potdFetcher");
const { getGFGPOTDWithPuppeteer } = require("./gfg");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  console.log("Scan this QR code to connect:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("WhatsApp connected.");

  cron.schedule("0 19 * * *", async () => {
    // await sendPOTD();
  });
  // Test sending POTD immediately after connecting
  await sendPOTD();
});

async function sendPOTD() {
  const gfgLink = await getGFGPOTDWithPuppeteer();
  const leetcodeLink = await getLeetCodePOTD();

  const msg = `🚀 *Daily Coding Challenge* 🚀

*GeeksforGeeks POTD:* ${gfgLink}
*LeetCode POTD:* ${leetcodeLink}

💡 Sharpen your skills, one problem at a time!
✨ Happy Coding! 💻🔥`;

  try {
    const chats = await client.getChats();
    const group = chats.find(
      (chat) => chat.name === "Teen Sherr 🦁🦁🦁 + SM Lord"
    );

    if (group) {
      await client.sendMessage(group.id._serialized, msg);
      console.log("POTD sent to group.");
    } else {
      console.log("Group not found. Please check the group name.");
    }
  } catch (err) {
    console.error("Error sending message:", err.message);
  }
}

client.initialize();
