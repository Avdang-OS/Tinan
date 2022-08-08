import { Message, TextChannel } from "discord.js";
// TODO: @Sammy99jsp -- sort out path aliases
import { MessageHandler } from "../../src/handlers/message";

const MsgDummy = new MessageHandler(/froxcey/i);

MsgDummy
  .channel()
    .is("0167236323623632")
  .react("⬛⬛⬛");

test("Correct channel id, and message. ", () => {
  let result = MsgDummy.test({
    content: "Hello there, froxcey!",
    channel: {
      id: "0167236323623632",
    },
  } as unknown as Message);

  expect(result).toEqual([true, true]);
});
