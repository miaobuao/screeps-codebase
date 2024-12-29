import nitroCloudflareBindings from 'nitro-cloudflare-dev'

export default defineNitroConfig({
	srcDir: 'server',
	modules: [nitroCloudflareBindings],
	compatibilityDate: '2024-12-29',
})
