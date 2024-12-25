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
		const target = creep.room.controller.pos.findClosestByRange(FIND_SOURCES)
		if (target) {
			if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } })
			}
		}
	}
}
