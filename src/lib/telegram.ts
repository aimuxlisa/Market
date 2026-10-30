import crypto from "crypto";

export interface ValidatedTelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

/**
 * Validates telegram initData against the bot token using HMAC-SHA256
 * Reference: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateTelegramInitData(
  initData: string,
  botToken: string
): { isValid: boolean; user: ValidatedTelegramUser | null; authDate: number | null } {
  if (!initData) {
    return { isValid: false, user: null, authDate: null };
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) {
      return { isValid: false, user: null, authDate: null };
    }

    // Sort parameters alphabetically
    const dataCheckArr: string[] = [];
    params.sort();
    for (const [key, value] of params.entries()) {
      if (key !== "hash") {
        dataCheckArr.push(`${key}=${value}`);
      }
    }
    const dataCheckString = dataCheckArr.join("\n");

    // Secret key is HMAC-SHA256 of botToken with constant "WebAppData"
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();

    // Calculated hash
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    const isValid = calculatedHash === hash;
    if (!isValid) {
      return { isValid: false, user: null, authDate: null };
    }

    const userRaw = params.get("user");
    const user: ValidatedTelegramUser | null = userRaw ? JSON.parse(userRaw) : null;
    const authDateRaw = params.get("auth_date");
    const authDate = authDateRaw ? parseInt(authDateRaw, 10) : null;

    return { isValid: true, user, authDate };
  } catch (error) {
    console.error("Failed to parse and validate telegram initData:", error);
    return { isValid: false, user: null, authDate: null };
  }
}
