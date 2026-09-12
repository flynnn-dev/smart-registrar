import { describe, expect, it } from "vitest";

import { getSupabaseProjectHost } from "@/lib/supabase/env";

describe("getSupabaseProjectHost", () => {
  it("reads the host from a valid project URL", () => {
    expect(
      getSupabaseProjectHost("https://zoxjrkuoyzkyxtbioguz.supabase.co")
    ).toBe("zoxjrkuoyzkyxtbioguz.supabase.co");
  });

  it("returns null for junk so a bad env cannot be used as a host", () => {
    expect(getSupabaseProjectHost("not-a-url")).toBeNull();
  });
});
