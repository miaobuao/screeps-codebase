export default function runUpgrader(creep: Creep) {
	if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
		creep.memory.upgrading = false
		creep.say('🔄 harvest')
	}

	if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
		creep.memory.upgrading = true
		creep.say('⚡ upgrade')
	}

	if (!creep.room.controller) {
		return
	}

	if (creep.memory.upgrading) {
		if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
			creep.moveTo(creep.room.controller, {
				visualizePathStyle: { stroke: '#ffffff' },
			})
		}
	} else {
		const resource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES)
		if (resource) {
			if (creep.pickup(resource) == ERR_NOT_IN_RANGE) {
				creep.moveTo(resource, { visualizePathStyle: { stroke: '#ffffff' } })
			}
		} else {
			const ruin = creep.room.controller.pos.findClosestByPath(FIND_RUINS, {
				filter: (source) => source.store.energy > 0,
			})
			if (ruin) {
				if (creep.withdraw(ruin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(ruin, { visualizePathStyle: { stroke: '#ffaa00' } })
				}
			} else {
				const source = creep.room.controller.pos.findClosestByPath(
					FIND_SOURCES,
					{
						filter: (source) => source.energy > 0,
					},
				)
				if (source) {
					if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
						creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
					}
				}
			}
		}
	}
}
