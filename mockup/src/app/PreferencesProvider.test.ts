import { expect, it } from "vitest";
import { defaultPreferences, parsePreferences } from "./PreferencesProvider";
it("respinge preferințe corupte sau necunoscute și păstrează selecțiile valide", () => {
  expect(parsePreferences("{")).toEqual(defaultPreferences);
  expect(parsePreferences(null)).toEqual(defaultPreferences);
  expect(
    parsePreferences('{"countyId":"inexistent","themes":[],"events":[]}'),
  ).toEqual(defaultPreferences);
  expect(
    parsePreferences('{"countyId":"bacau","themes":["__proto__"],"events":[]}'),
  ).toEqual(defaultPreferences);
  const valid = {
    countyId: "neamt",
    themes: ["scoli", "sanatate"],
    events: ["delivery"],
  };
  expect(parsePreferences(JSON.stringify(valid))).toEqual(valid);
});
