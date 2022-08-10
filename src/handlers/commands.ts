import { Tinan } from "../types";
import { Interaction, REST, Routes, } from "discord.js";
import fs from "fs";
import { config as env } from "dotenv";
import path from "path";
env();

export default function() {
  // Get all command handlers inside the src/commands folder.
  const cmdHandlers = fs.readdirSync(path.join(__dirname, "../commands"))
    .filter(name => name.endsWith(".js"))
    .map(name => require(path.join(__dirname,`../commands/${name}`)).default as Tinan.Command);
  
  // Register the commands with Discord or something
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN ?? "");
  


  // Load API things on every server.
  Promise.all(
    (process.env.GUILD_ID ?? "").split(",")
      .map(guild => 
          rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID ?? "", guild),
            { body: cmdHandlers.map(cmd => cmd.options.toJSON())}
          )
            .catch(console.error)
      )
  ).then(() => console.log("Commands Ready!"))


  // Make a map of all command interactions.
  let commandNameMap : Record<string, Tinan.Command> = {};

  cmdHandlers.forEach((cmd : Tinan.Command) => {
    commandNameMap[cmd.options.name] = cmd as Tinan.Command;
  });

  return {
    interactionHandler : async (interaction : Interaction) => {
      // console.log(interaction)
      if(interaction.isChatInputCommand()) {
        await commandNameMap[interaction.commandName].command(interaction);
      }

      if(interaction.isButton()) {
        let fn = commandNameMap[interaction.customId.split("-")[0]]?.button ?? (btn => {});
        fn(interaction);
      }
  }}
}