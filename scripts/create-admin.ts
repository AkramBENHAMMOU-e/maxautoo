import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@carental.com'
    },
    update: {},
    create: {
      email: 'admin@carental.com',
      password,
      role: 'ADMIN'
    }
  })

  console.log({ admin })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 