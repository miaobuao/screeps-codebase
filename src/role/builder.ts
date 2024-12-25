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
		const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
		const closestSource = creep.pos.findClosestByPath(FIND_SOURCES)
		if (!closestSource) {
			if (creep.build(target!) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target!, { visualizePathStyle: { stroke: '#ffffff' } })
			}
			return
		}
		if (!target) {
			return
		}
		const closest = creep.pos.findClosestByPath([target, closestSource])
		if (closest === closestSource) {
			creep.moveTo(target!, { visualizePathStyle: { stroke: '#ffffff' } })
		} else {
			if (creep.build(target!) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target!, { visualizePathStyle: { stroke: '#ffffff' } })
			}
		}
		return
	}
	const source = creep.pos.findClosestByPath(FIND_SOURCES, {
		filter: (source) => source.energy > 0,
	})
	if (source) {
		if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
			creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
		}
	}
}
