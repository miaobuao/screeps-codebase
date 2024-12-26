import Sp1System from './systems/sp1'

export function loop() {
	if (Game.cpu.bucket >= 5000) {
		Game.cpu.generatePixel()
	}
	const sp1 = new Sp1System(Game.spawns['sp1'])
	sp1.run()
}
