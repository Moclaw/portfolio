import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	server: {
		watch: {
		  usePolling: true,
		  ignored: ['**/.git/**']
		},
		host: true, // needed for the Docker Container port mapping to work
		strictPort: true,
		port: 5300, // you can replace this port with any port
		allowedHosts: ['moclawr.com']
	  }
})
