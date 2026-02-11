import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  notionApiKey: process.env.NOTION_API_KEY || '',
  notionDatabaseId: process.env.NOTION_DATABASE_ID || '',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  allowedEmailDomain: process.env.ALLOWED_EMAIL_DOMAIN || 'mit.edu',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
};
