import mongoose from 'mongoose'
import app from './app'
import { env } from './config/env'

async function main() {
  await mongoose.connect(env.MONGO_URI)
  const server = app.listen(env.PORT, () => console.log(`API listening on http://localhost:${env.PORT}`))
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']
  signals.forEach((s) => process.on(s, async () => {
    console.log(`Received ${s}, shutting down...`)
    server.close()
    await mongoose.disconnect()
    process.exit(0)
  }))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
