/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `criadoEm` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `id_user` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `type` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `criadoEm`,
    ADD COLUMN `created_in` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `type` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id_user`);
