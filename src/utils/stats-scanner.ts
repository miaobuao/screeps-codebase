// https://www.jianshu.com/p/de74baf6fb48

interface Components {
	harvest: { count: number }
	transfer: { count: number }
	upgrade: { count: number }
	build: { count: number }
}

interface Entity {
	entityCount: number
	components: Partial<Components>
}

interface Resource {
	energy: number
}

declare global {
	interface Memory {
		stats?: Partial<{
			gcl: number
			gclLevel: number
			gpl: number
			gplLevel: number
			cpu: number
			bucket: number
			resource: Partial<Resource>
			entity: Partial<Entity>
		}>
	}
}

export default function statsScanner() {
	if (!Memory.stats) Memory.stats = {}

	// 统计 GCL / GPL 的升级百分比和等级
	Memory.stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100
	Memory.stats.gclLevel = Game.gcl.level
	Memory.stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100
	Memory.stats.gplLevel = Game.gpl.level

	// CPU 的当前使用量
	Memory.stats.cpu = Game.cpu.getUsed()
	// bucket 当前剩余量
	Memory.stats.bucket = Game.cpu.bucket
}
