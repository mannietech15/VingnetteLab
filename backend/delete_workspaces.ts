import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.canvasMetadata.deleteMany({});
  await prisma.workspace.deleteMany({});
  console.log("All workspaces and canvases deleted.");
}
main().finally(() => prisma.$disconnect());
