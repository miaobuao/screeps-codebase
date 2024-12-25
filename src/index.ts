import { groupBy, isNil, map } from 'lodash-es'
import { Role, SPAWN_NAME } from './consts'
import runBuilder from './role/builder'
import runHarvester from './role/harvester'
import runUpgrader from './role/upgrader'

declare global {
	interface CreepMemory {
		role: Role
		upgrading?: boolean
		building?: boolean
	}
}

export function loop() {
	if (Game.cpu.bucket >= 5000) {
		Game.cpu.generatePixel()
	}
	// Clean up dead creeps
	for (const name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name]
		}
	}
	const {
		[Role.harvester]: harvesters,
		[Role.upgrader]: upgraders,
		[Role.builder]: builders,
	} = groupBy(Game.creeps, (creep) => creep.memory.role)
	if (!harvesters || !Object.keys(harvesters).length) {
		console.log('No harvesters')
	}
	if (!upgraders || !Object.keys(upgraders).length) {
		console.log('No upgraders')
	}

	if (Game.spawns[SPAWN_NAME].spawning) {
		const spawningCreep = Game.creeps[Game.spawns[SPAWN_NAME].spawning.name]
		Game.spawns[SPAWN_NAME].room.visual.text(
			'🛠️' + spawningCreep.memory.role,
			Game.spawns[SPAWN_NAME].pos.x + 1,
			Game.spawns[SPAWN_NAME].pos.y,
			{ align: 'left', opacity: 0.8 },
		)
	} else {
		// Spawn new creeps
		const extensions = Game.spawns[SPAWN_NAME].room.find(FIND_STRUCTURES, {
			filter: (s) => s.structureType == STRUCTURE_EXTENSION,
		})
		const body =
			extensions.length > 2
				? [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]
				: extensions.length > 1
					? [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
					: extensions.length > 0
						? [WORK, WORK, CARRY, CARRY, MOVE]
						: [WORK, CARRY, MOVE]
		const hasSite =
			Game.spawns[SPAWN_NAME].room.find(FIND_CONSTRUCTION_SITES).length > 0
		if (isNil(upgraders) || upgraders.length < (hasSite ? 1 : 2)) {
			const newName = 'Upgrader-' + Game.time
			Game.spawns[SPAWN_NAME].spawnCreep(body, newName, {
				memory: {
					role: Role.upgrader,
				},
			})
		}
		if (isNil(harvesters) || harvesters.length < (hasSite ? 1 : 2)) {
			const newName = 'Harvester-' + Game.time
			Game.spawns[SPAWN_NAME].spawnCreep(body, newName, {
				memory: {
					role: Role.harvester,
				},
			})
		}
		if (isNil(builders) || builders.length < (hasSite ? 1 : 0)) {
			const newName = 'Builder-' + Game.time
			Game.spawns[SPAWN_NAME].spawnCreep(body, newName, {
				memory: {
					role: Role.builder,
				},
			})
		}
	}

	map(harvesters, runHarvester)
	map(upgraders, runUpgrader)
	map(builders, runBuilder)
}
