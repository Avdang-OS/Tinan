import { EmbedBuilder } from "discord.js"


export function Error() : EmbedBuilder {
  return (
    new EmbedBuilder()
      .setColor("Red")
  )
}