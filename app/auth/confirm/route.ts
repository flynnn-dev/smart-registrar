import { completeEmailAuth } from "@/lib/auth/complete-auth";

export async function GET(request: Request) {
  return completeEmailAuth(request);
}
