import type { Client, ClientEvents } from "discord.js";
import { substringOrRegex as R } from "../../src/utils/formatDetector";

// These return RegEx

test("Clearly Regex", () => {
  expect(R("/apples/")).toEqual(/apples/);
});

test("Escaped Regex", () => {
  expect(R("/apples\\/oranges/gi")).toEqual(/apples\/oranges/gi);
});

// These are just normal strings.
test("Fully Escaped Regex", () => {
  expect(R("\\/you though I was RegEx didn't you?\\/")).toEqual(
    "\\/you though I was RegEx didn't you?\\/"
  );
});

test("Malformed Regex", () => {
  expect(R("apples/oranges/bananas")).toEqual("apples/oranges/bananas");
});

test("Substring", () => {
  expect(R("apples aren't oranges")).toEqual("apples aren't oranges");
});

type A = keyof ClientEvents;
