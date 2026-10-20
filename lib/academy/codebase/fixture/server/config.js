// Every setting the server reads from the environment, in one place.
export const config = {
  port: Number(process.env.PORT) || 4000,
  sessionSecret: process.env.SESSION_SECRET,
  dataFile: process.env.DATA_FILE || "data/kobo.json",
  paystackSecret: process.env.PAYSTACK_SECRET_KEY || "",
};

export function assertConfig() {
  if (!config.sessionSecret) {
    throw new Error("SESSION_SECRET is not set. Copy .env.example to .env and fill it in.");
  }
}
