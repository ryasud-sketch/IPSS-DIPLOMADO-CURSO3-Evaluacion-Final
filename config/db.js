import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

// ---------------------------------------------------------------------------
// CONFIG — conexión a MongoDB.
// ---------------------------------------------------------------------------

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  throw new Error(
    'MONGODB_URI no está definido. Copia .env.example a .env y configura tu URI de MongoDB.'
  )
}
export const conectar = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log(`🍃 conectado a MongoDB → base "${mongoose.connection.name}"`)
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error.message)
    process.exit(1)
  }
}
