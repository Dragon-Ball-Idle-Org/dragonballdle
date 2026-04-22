import { describe, it, expect } from "vitest";
import { cn } from "../../cn";

describe("cn utility", () => {
  it("should merge classes together", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("should handle conditional classes", () => {
    const isTrue = true;
    const isFalse = false;
    
    expect(cn("base", isTrue && "active", isFalse && "inactive")).toBe("base active");
  });

  it("should correctly resolve Tailwind class conflicts", () => {
    // twMerge behavior: last class wins for same property
    expect(cn("p-4 p-8")).toBe("p-8");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });
});
