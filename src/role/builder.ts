export default function runBuilder(creep: Creep) {
	if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
		creep.memory.building = false
		creep.say('🔄 harvest')
	}
	if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
		creep.memory.building = true
		creep.say('🚧 build')
	}

	if (creep.memory.building) {
		const resource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES)
		if (resource) {
			if (creep.pickup(resource) == ERR_NOT_IN_RANGE) {
				creep.moveTo(resource, { visualizePathStyle: { stroke: '#ffffff' } })
			}
		} else {
			const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
			if (target) {
				if (creep.build(target!) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target!, { visualizePathStyle: { stroke: '#ffffff' } })
				}
			}
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
}
