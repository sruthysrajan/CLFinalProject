"use client";

import { useMemo } from "react";

import { searchFaqs } from "@/lib/faq-search";

export function useFaqSearch(query: string) {
  return useMemo(() => searchFaqs(query), [query]);
}
