import { prisma } from "@/lib/db";

const SIGNUP_CODE_KEY = "signupCode";

export async function getSignupCode(): Promise<string> {
  const row = await prisma.appSetting.findUnique({
    where: { key: SIGNUP_CODE_KEY },
  });
  if (!row) {
    throw new Error(
      `AppSetting "${SIGNUP_CODE_KEY}" is missing — run \`npm run db:seed\`.`
    );
  }
  return row.value;
}

export async function setSignupCode(value: string): Promise<void> {
  await prisma.appSetting.upsert({
    where: { key: SIGNUP_CODE_KEY },
    update: { value },
    create: { key: SIGNUP_CODE_KEY, value },
  });
}
