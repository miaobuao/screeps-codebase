import gzip from 'gzip-js'
import { memoryTable } from '~/db/schema'
import { SCREEPS_MEMORY_API } from '~/utils/consts'

export default eventHandler(async (event) => {
	const { shard, path, token } = getQuery(event)
	if (!shard) {
		return new Response('shard required', { status: 400 })
	}
	if (!path) {
		return new Response('path required', { status: 400 })
	}
	if (!token) {
		return new Response('token required', { status: 400 })
	}

	const strShard = shard.toString()
	const strPath = path.toString()
	const strToken = token.toString()

	const url = new URL(SCREEPS_MEMORY_API)
	url.searchParams.set('shard', strShard)
	url.searchParams.set('path', strPath)
	const res = await fetch(url.toString(), {
		headers: {
			'X-Token': strToken,
		},
	}).then<{ ok: number; data: string }>((d) => d.json())

	if (res?.data?.startsWith('gz:')) {
		const buf = Buffer.from(res.data.slice(3), 'base64')
		const unzip = gzip.unzip(buf)
		const data = Buffer.from(unzip).toString('utf-8')

		await event.context.db.insert(memoryTable).values({
			shard: strShard,
			path: strPath,
			token: strToken,
			data,
			datetime: Date.now(),
		})

		return {
			...res,
			data: JSON.parse(data),
		}
	}

	return res
})
