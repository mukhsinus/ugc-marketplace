interface EnvConfig {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  PORT: number;
}

function validateEnv(): EnvConfig {
  const required = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    SUPABASE_URL: required.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: required.SUPABASE_SERVICE_ROLE_KEY,
    PORT: Number(process.env.PORT) || 4000,
  };
}

export const envConfig = validateEnv();