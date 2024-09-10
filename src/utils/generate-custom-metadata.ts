import { Metadata } from "next";

export function generateCustomMetadata(input?: string): Metadata {
  return {
    title: input ? `${input} - LibraSoft` : "LibraSoft",
  };
}
