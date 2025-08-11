import { describe, it, expect } from "vitest";

describe("Basic Math Operations", () => {
  it("should add two numbers correctly", () => {
    expect(2 + 2).toBe(4);
    expect(10 + 5).toBe(15);
    expect(-1 + 1).toBe(0);
  });

  it("should subtract two numbers correctly", () => {
    expect(5 - 3).toBe(2);
    expect(10 - 10).toBe(0);
    expect(0 - 5).toBe(-5);
  });

  it("should multiply two numbers correctly", () => {
    expect(3 * 4).toBe(12);
    expect(5 * 0).toBe(0);
    expect(-2 * 3).toBe(-6);
  });

  it("should divide two numbers correctly", () => {
    expect(10 / 2).toBe(5);
    expect(9 / 3).toBe(3);
    expect(0 / 5).toBe(0);
  });

  it("should handle edge cases", () => {
    expect(1 / 0).toBe(Infinity);
    expect(-1 / 0).toBe(-Infinity);
    expect(0 / 0).toBeNaN();
  });
});
