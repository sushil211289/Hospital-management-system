import { seedDatabase } from "../src/lib/hospital-db";

async function main() {
  await seedDatabase();
}

main()
  .then(() => {
    console.log("Seeded meridian_his");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    const { prisma } = await import("../src/lib/db");
    await prisma.$disconnect();
  });
