import { describe, expect, it } from "vitest";
import { parseSteamWorkshopDate } from "../src/modFunctions";

describe("Steam Workshop date parsing", () => {
  it("parses dates with explicit year in America/Phoenix timezone", () => {
    // "2 Oct, 2021 @ 11:25am" in Phoenix (MST, UTC-7) = 2021-10-02 18:25:00 UTC
    const timestamp = parseSteamWorkshopDate("2 Oct, 2021 @ 11:25am");
    expect(timestamp).toBeDefined();
    expect(new Date(timestamp!).toISOString()).toBe("2021-10-02T18:25:00.000Z");
    expect(timestamp).toBe(1_633_199_100_000);
  });

  it("parses dates with two-digit days and two-digit hours", () => {
    // "15 Dec, 2023 @ 11:30pm" in Phoenix (MST, UTC-7) = 2023-12-16 06:30:00 UTC
    const timestamp = parseSteamWorkshopDate("15 Dec, 2023 @ 11:30pm");
    expect(timestamp).toBeDefined();
    expect(new Date(timestamp!).toISOString()).toBe("2023-12-16T06:30:00.000Z");
  });

  it("parses dates with single-digit days and single-digit hours", () => {
    // "5 May, 2022 @ 1:05pm" in Phoenix (MST, UTC-7) = 2022-05-05 20:05:00 UTC
    const timestamp = parseSteamWorkshopDate("5 May, 2022 @ 1:05pm");
    expect(timestamp).toBeDefined();
    expect(new Date(timestamp!).toISOString()).toBe("2022-05-05T20:05:00.000Z");
  });

  it("parses morning (am) timestamps correctly", () => {
    // "10 Jan, 2023 @ 8:15am" in Phoenix (MST, UTC-7) = 2023-01-10 15:15:00 UTC
    const timestamp = parseSteamWorkshopDate("10 Jan, 2023 @ 8:15am");
    expect(timestamp).toBeDefined();
    expect(new Date(timestamp!).toISOString()).toBe("2023-01-10T15:15:00.000Z");
  });

  it("uses reference date year when year is omitted in steam date", () => {
    const referenceDate = new Date(2024, 0, 1);
    const timestamp = parseSteamWorkshopDate("24 Mar @ 3:45pm", referenceDate);
    expect(timestamp).toBeDefined();
    expect(new Date(timestamp!).toISOString()).toBe("2024-03-24T22:45:00.000Z");
  });

  it("safely handles empty, incomplete, or invalid date strings", () => {
    expect(parseSteamWorkshopDate("")).toBeUndefined();
    expect(parseSteamWorkshopDate("2 Oct")).toBeUndefined();
    expect(parseSteamWorkshopDate("Updated yesterday")).toBeUndefined();
    expect(parseSteamWorkshopDate("invalid @ string")).toBeUndefined();
  });
});
