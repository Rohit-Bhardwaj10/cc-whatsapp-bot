# WhatsApp Daily Coding Challenge Bot

This project is a WhatsApp bot that automatically sends daily coding challenge links (GeeksforGeeks and LeetCode POTD) to a specified WhatsApp group using Node.js and whatsapp-web.js.

## Features

- Sends GeeksforGeeks and LeetCode Problem of the Day links to your group
- Scheduled to run daily at a specified time (default: 7pm)
- Uses web scraping and GraphQL to fetch the latest problems

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Rohit-Bhardwaj10/cc-whatsapp-bot.git
   cd cc-whatsapp-bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the bot**

   ```bash
   node index.js
   ```

4. **Scan the QR code**

   - When you run the bot, a QR code will appear in the terminal.
   - Open WhatsApp on your phone → Linked Devices → Link a Device → Scan the QR code.

5. **Configure group name**
   - Edit `index.js` and set the group name to match your WhatsApp group exactly (including emojis and spaces).

## Cloud Hosting

- You can run this bot on a cloud VM (AWS, GCP, Azure, DigitalOcean, etc.) for 24/7 uptime.
- After deploying, scan the QR code from the cloud VM's terminal.
- Use a process manager like PM2 to keep the bot running.

## Security

- **Do NOT upload `.wwebjs_auth/` or `.wweb_cache/` folders to GitHub.**
- These folders contain sensitive authentication data and are excluded via `.gitignore`.

## Troubleshooting

- If the bot is not sending messages, check:
  - The group name matches exactly
  - The account is a member of the group
  - The cron job is scheduled correctly
- Check the terminal for error logs.

## License

MIT
