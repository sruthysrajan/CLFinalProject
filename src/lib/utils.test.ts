import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins truthy class names and omits empty values", () => {
    expect(cn("flex", false, "items-center", null, undefined, "gap-2")).toBe(
      "flex items-center gap-2",
    );
  });
});
