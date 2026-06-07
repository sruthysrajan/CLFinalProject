import { describe, expect, it } from "vitest";

import { getDefaultFaqs, searchFaqs } from "@/lib/faq-search";

function getResultIds(query: string) {
  return searchFaqs(query).map((result) => result.faq.id);
}

describe("FAQ search", () => {
  it("returns housing FAQ for a housing query", () => {
    expect(getResultIds("housing")).toContain("faq_no_housing");
  });

  it("returns BSN FAQ for a BSN query", () => {
    expect(getResultIds("bsn")).toContain("faq_bsn_no_address");
  });

  it("returns health FAQ for an insurance query", () => {
    expect(getResultIds("insurance")).toContain("faq_health_insurance_work");
  });

  it("returns default FAQ results for an empty query", () => {
    const results = getDefaultFaqs();
    const ids = getResultIds("");

    expect(results.length).toBeGreaterThan(0);
    expect(ids).toEqual(results.map((result) => result.faq.id));
    expect(ids).toContain("faq_no_housing");
    expect(ids).toContain("faq_bsn_no_address");
    expect(ids).toContain("faq_health_insurance_work");
  });

  it("returns no results for an unknown query", () => {
    expect(searchFaqs("zzzzzzzz-no-match")).toEqual([]);
  });
});
