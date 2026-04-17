import { hashSha256 } from "./encryption";

export function verifyHash(content: string, expected: string): boolean {
  return hashSha256(content) === expected;
}
