import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const memoryTable = sqliteTable(
	'memory',
	{
		id: int().primaryKey({ autoIncrement: true }),
		token: text().notNull(),
		shard: text().notNull(),
		path: text().notNull(),
		data: text().notNull(),
		datetime: int().notNull(),
	},
	(table) => ({
		tokenIndex: index('token_index').on(table.token),
	}),
)
