import System from './system'

const sys = new System()

export function loop() {
	if (Game.cpu.bucket >= 5000) {
		Game.cpu.generatePixel()
	}
	sys.setupSpawnSystem()
	sys.run()
}
