/*
  Warnings:

  - You are about to drop the column `pratoId` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `preco_unitario_snapshot` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `valor_total` on the `Pedido` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ItemPedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL,
    "pratoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_unitario_no_momento_do_pedido" REAL NOT NULL,
    "subtotal_item" REAL NOT NULL,
    CONSTRAINT "ItemPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemPedido_pratoId_fkey" FOREIGN KEY ("pratoId") REFERENCES "Prato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_cliente" INTEGER,
    "id_fornecedor" INTEGER NOT NULL,
    "nomeCliente" TEXT NOT NULL,
    "contatoCliente" TEXT,
    "tipoEntrega" TEXT NOT NULL,
    "enderecoEntrega" TEXT,
    "observacoes" TEXT,
    "valor_total_pedido" REAL,
    "status" TEXT NOT NULL DEFAULT 'NOVO',
    "time_do_pedido" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pedido_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pedido_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "Fornecedor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pedido" ("contatoCliente", "enderecoEntrega", "id", "id_cliente", "id_fornecedor", "nomeCliente", "observacoes", "status", "time_do_pedido", "tipoEntrega", "updatedAt") SELECT "contatoCliente", "enderecoEntrega", "id", "id_cliente", "id_fornecedor", "nomeCliente", "observacoes", "status", "time_do_pedido", "tipoEntrega", "updatedAt" FROM "Pedido";
DROP TABLE "Pedido";
ALTER TABLE "new_Pedido" RENAME TO "Pedido";
CREATE INDEX "Pedido_id_cliente_idx" ON "Pedido"("id_cliente");
CREATE INDEX "Pedido_id_fornecedor_idx" ON "Pedido"("id_fornecedor");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ItemPedido_pedidoId_idx" ON "ItemPedido"("pedidoId");

-- CreateIndex
CREATE INDEX "ItemPedido_pratoId_idx" ON "ItemPedido"("pratoId");
