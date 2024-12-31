import dayjs from 'dayjs'
import { and, eq, gte, lte } from 'drizzle-orm'
import { map } from 'lodash-es'
import { memoryTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
	const { token, shard, startTime, endTime, limit, path } = getQuery(event)

	if (!token) {
		return new Response('token required', { status: 400 })
	}

	const _token = token.toString()
	const _startTime = startTime ? dayjs(startTime.toString()) : dayjs(0)
	const _endTime = endTime ? dayjs(endTime.toString()) : dayjs()
	const _limit = limit ? parseInt(limit.toString()) : undefined

	return map(
		await event.context.db.query.memoryTable.findMany({
			where: and(
				eq(memoryTable.token, _token),
				shard && eq(memoryTable.shard, shard.toString()),
				path && eq(memoryTable.path, path.toString()),
				gte(memoryTable.datetime, _startTime.toDate().getTime()),
				lte(memoryTable.datetime, _endTime.toDate().getTime()),
			),
			limit: _limit,
		}),
		(d) => {
			return {
				...d,
				data: JSON.parse(d.data),
				datetime: dayjs(d.datetime).format('YYYY-MM-DD HH:mm:ss'),
				timestamp: d.datetime,
			}
		},
	)
})
