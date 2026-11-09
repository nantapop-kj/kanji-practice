import type { Lang } from "../generated/prisma/client.js";

const ZeroWidth = /[​-‍﻿]/g;
const EnglishLeadingWords = /^(to|a|an|the)\s+/;
const IgnoredMarks = /[\s.,\-()（）、。・'"’!?]/g;

export const normalize = (value: string, lang?: Lang): string => {
  let text = value.normalize("NFC").replace(ZeroWidth, "").trim().toLowerCase();
  if (lang === "en") text = text.replace(EnglishLeadingWords, "");

  return text.replace(IgnoredMarks, "");
};
