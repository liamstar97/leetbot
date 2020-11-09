# Leetbot
A bot that serves up leetcode problems, and allows users to interact with a persistent leaderboard.
## Setup:
#### To build and run the bot you require the following dependencies:
* [Node.js](https://nodejs.org/en/)
* [Discord Bot Application & Token](https://discordjs.guide/preparations/setting-up-a-bot-application.html)

#### Installing libraries and creating .env:
###### Windows/Linux:
```
> npm install
> echo prefix = "!" >> .env & echo TOKEN = "DiscordBotToken" >> .env
```
_Ensure you include your bots token where TOKEN = "DiscordBotToken"_

####Running bot:
```
> node index.js
```