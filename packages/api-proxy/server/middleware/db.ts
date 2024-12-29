import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1'
import * as schema from '~/db/schema'

declare module 'h3' {
	interface H3EventContext {
		db: DrizzleD1Database<typeof schema>
	}
}

let cloudflare

export default defineEventHandler(async ({ context }) => {
	cloudflare ||= context.cloudflare
	const { DB } = (context.cloudflare || cloudflare).env
	context.db = drizzle(DB, { schema: { ...schema } })
})
