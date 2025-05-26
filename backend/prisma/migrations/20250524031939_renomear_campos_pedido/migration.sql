/*
  Warnings:

  - You are about to drop the column `clienteId` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Pedido` table. All the data in the column will be lost.
  - Added the required column `id_fornecedor` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeCliente` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preco_unitario_snapshot` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoEntrega` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_total` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_cliente" INTEGER,
    "pratoId" INTEGER NOT NULL,
    "id_fornecedor" INTEGER NOT NULL,
    "nomeCliente" TEXT NOT NULL,
    "contatoCliente" TEXT,
    "tipoEntrega" TEXT NOT NULL,
    "enderecoEntrega" TEXT,
    "observacoes" TEXT,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "preco_unitario_snapshot" REAL NOT NULL,
    "valor_total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOVO',
    "time_do_pedido" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pedido_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pedido_pratoId_fkey" FOREIGN KEY ("pratoId") REFERENCES "Prato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pedido_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "Fornecedor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pedido" ("id", "pratoId", "status", "updatedAt") SELECT "id", "pratoId", "status", "updatedAt" FROM "Pedido";
DROP TABLE "Pedido";
ALTER TABLE "new_Pedido" RENAME TO "Pedido";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
