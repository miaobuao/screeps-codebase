export default function runHarvester(creep: Creep) {
	if (creep.store.getFreeCapacity() > 0) {
		const resource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES)
		if (resource) {
			if (creep.pickup(resource) == ERR_NOT_IN_RANGE) {
				creep.moveTo(resource, { visualizePathStyle: { stroke: '#ffffff' } })
			}
		} else {
			const ruin = creep.pos.findClosestByPath(FIND_RUINS, {
				filter: (ruin) => ruin.store.energy > 0,
			})
			if (ruin) {
				if (creep.withdraw(ruin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(ruin, { visualizePathStyle: { stroke: '#ffaa00' } })
				}
			} else {
				const source = creep.pos.findClosestByPath(FIND_SOURCES, {
					filter: (source) => source.energy > 0,
				})
				if (source) {
					if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
						creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
					}
				}
			}
		}
	} else {
		const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure) => {
				return (
					(structure.structureType == STRUCTURE_EXTENSION ||
						structure.structureType == STRUCTURE_SPAWN) &&
					structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
				)
			},
		})
		if (target) {
			if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } })
			}
		}
		// else {
		// 	const hasSite =
		// 		Game.spawns[SPAWN_NAME].room.find(FIND_CONSTRUCTION_SITES).length > 0
		// 	if (hasSite) {
		// 		creep.memory.role = Role.builder
		// 	} else {
		// 		creep.memory.role = Role.upgrader
		// 	}
		// }
	}
}
