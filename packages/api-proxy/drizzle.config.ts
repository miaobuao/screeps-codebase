import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	out: './drizzle',
	schema: './server/db/schema.ts',
	dialect: 'sqlite',
	driver: 'd1-http',
})
