import BaseEntity from '@/entities/base'
import { map } from 'lodash-es'
import SpawnSystem from './spawn'

const entitiesData: Record<string, BaseEntity<any> | undefined> = {}

export default class System {
	spawnSystems: Record<string, SpawnSystem> = {}

	constructor() {
		this.setupSpawnSystem()
	}

	run() {
		map(this.spawnSystems, (sys) => {
			sys.clearState()
			sys.initializeEntities()
			sys.run()
			if (Game.time % 20 === 0) {
				sys.stats()
			}
		})
		if (Game.time % 20 === 0) {
			this.stats()
		}
	}

	stats() {
		if (!Memory.stats) Memory.stats = {}
		const stats = Memory.stats.game || {}
		Memory.stats.game = stats

		// 统计 GCL / GPL 的升级百分比和等级
		stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100
		stats.gclLevel = Game.gcl.level
		stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100
		stats.gplLevel = Game.gpl.level

		// CPU 的当前使用量
		stats.cpu = Game.cpu.getUsed()
		// bucket 当前剩余量
		stats.bucket = Game.cpu.bucket
	}

	setupSpawnSystem() {
		for (const spawnName in this.spawnSystems) {
			if (!Game.spawns[spawnName]) {
				delete this.spawnSystems[spawnName]
			}
		}
		for (const spawnName in Game.spawns) {
			if (!this.spawnSystems[spawnName]) {
				this.spawnSystems[spawnName] = new SpawnSystem(spawnName)
			}
		}
	}
}
