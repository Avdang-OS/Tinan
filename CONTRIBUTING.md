# Tinan Contributing Guide

## Prerequisites

If you want to contribute to this repository, you need basic knowledge of TypeScript and discord.js. 

You have to have a contribution fork of this repository.

## Code convention

- 2 space indent, no tab.
- `const` by default and `let` for reassignable. 
- SCREAMING_SNAKE_CASE for `const` and camelCase for `let`.

## Setting up a Discord bot

Step 1: Go to the [Discord Developer Portal](https://discord.com/developers/applications) and log into your Discord account.

Step 2: Click on the "New Application" button near your profile picture on the upper right side of your screen and create a new application. Name it anything you want.

Step 3: Click on the "Bot" button on the left side of your screen and create a new bot.

### Step 4. Invite your bot to your server.

Step 4.1: Click on "OAuth2", afterward "URL Generator". Select `bot` and `applications.commands` in the list of scopes.

Step 4.2: Select "Administrator" in the list of bot permissions.

Step 4.3: Copy the link at the bottom of the page and paste it into your search bar.

Step 4.4: Select the server where you want your bot to be in the dropdown list.

Step 5: Reset your bot's token and copy it. It will be used later.

## Making it work

# **Step 6: .env magic (huge for devs to not add any example.env's into the repo)**
## **Step 6.1: Make a `.env` file in the project's root directory.**
## **Step 6.2: Inside `.env`, type `TOKEN=your bot token`.**

Step 7: In your terminal, run `npm install`. It will install all the modules needed to run the bot.

Step 8: Run `npm run start` to launch the bot.

## Optional config.json stuff

Step 1: Create a channel (or channels) in your server and name it/them anything you want.

If you haven't enabled Developer Mode, you can do so by going into Settings > Advanced > Developer Mode.

Step 2: Copy your channel's ID by right clicking on it and selecting `Copy ID`.

Step 3: Paste the channel's ID into your config.json file.

## How to make commands or events

If you want to create commands, you can view example commands in the `examples/commands` folder.

If you want to create events, you can view example events in the `examples/events` folder.

## Pull requests

Remember to put a short and concise list of changes to make the review process easier.

# ***PLEASE SUBMIT A PR, NO DIRECT COMMITS!***

![image](https://user-images.githubusercontent.com/51555391/176925763-cdfd57ba-ae1e-4bf3-85e9-b3ebd30b1d59.png)
