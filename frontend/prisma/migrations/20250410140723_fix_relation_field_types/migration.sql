/*
  Warnings:

  - You are about to alter the column `BUSINESS_ID` on the `business_2_business_category` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `BUSINESS_CATEGORY_ID` on the `business_2_business_category` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `BUSINESS_ID` on the `business_2_food_type` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `BUSINESS_ID` on the `food_menu` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `FOOD_MENU_ID` on the `food_menu_items` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `MENU_CATEGORY_ID` on the `food_menu_items` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `BUSINESS_OWNER_ID` on the `owner_2_business` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `BUSINESS_ID` on the `owner_2_business` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `business_2_business_category` MODIFY `BUSINESS_ID` INTEGER NULL,
    MODIFY `BUSINESS_CATEGORY_ID` INTEGER NULL;

-- AlterTable
ALTER TABLE `business_2_food_type` MODIFY `BUSINESS_ID` INTEGER NULL;

-- AlterTable
ALTER TABLE `food_menu` MODIFY `BUSINESS_ID` INTEGER NULL;

-- AlterTable
ALTER TABLE `food_menu_items` MODIFY `FOOD_MENU_ID` INTEGER NULL,
    MODIFY `MENU_CATEGORY_ID` INTEGER NULL;

-- AlterTable
ALTER TABLE `owner_2_business` MODIFY `BUSINESS_OWNER_ID` INTEGER NULL,
    MODIFY `BUSINESS_ID` INTEGER NULL;

-- CreateIndex
CREATE INDEX `business_2_business_category_BUSINESS_ID_idx` ON `business_2_business_category`(`BUSINESS_ID`);

-- CreateIndex
CREATE INDEX `business_2_business_category_BUSINESS_CATEGORY_ID_idx` ON `business_2_business_category`(`BUSINESS_CATEGORY_ID`);

-- CreateIndex
CREATE INDEX `business_2_food_type_BUSINESS_ID_idx` ON `business_2_food_type`(`BUSINESS_ID`);

-- CreateIndex
CREATE INDEX `business_2_food_type_FOOD_TYPE_ID_idx` ON `business_2_food_type`(`FOOD_TYPE_ID`);

-- CreateIndex
CREATE INDEX `city_town_CITY_ID_idx` ON `city_town`(`CITY_ID`);

-- CreateIndex
CREATE INDEX `food_menu_BUSINESS_ID_idx` ON `food_menu`(`BUSINESS_ID`);

-- CreateIndex
CREATE INDEX `food_menu_FOOD_CATEGORY_ID_idx` ON `food_menu`(`FOOD_CATEGORY_ID`);

-- CreateIndex
CREATE INDEX `food_menu_items_FOOD_MENU_ID_idx` ON `food_menu_items`(`FOOD_MENU_ID`);

-- CreateIndex
CREATE INDEX `food_menu_items_MENU_CATEGORY_ID_idx` ON `food_menu_items`(`MENU_CATEGORY_ID`);

-- CreateIndex
CREATE INDEX `foodeez_ranking_BUSINESS_ID_idx` ON `foodeez_ranking`(`BUSINESS_ID`);

-- CreateIndex
CREATE INDEX `menu_category_BUSINESS_ID_idx` ON `menu_category`(`BUSINESS_ID`);

-- CreateIndex
CREATE INDEX `owner_2_business_BUSINESS_OWNER_ID_idx` ON `owner_2_business`(`BUSINESS_OWNER_ID`);

-- CreateIndex
CREATE INDEX `owner_2_business_BUSINESS_ID_idx` ON `owner_2_business`(`BUSINESS_ID`);

-- AddForeignKey
ALTER TABLE `business_2_business_category` ADD CONSTRAINT `business_2_business_category_BUSINESS_ID_fkey` FOREIGN KEY (`BUSINESS_ID`) REFERENCES `business`(`BUSINESS_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `business_2_business_category` ADD CONSTRAINT `business_2_business_category_BUSINESS_CATEGORY_ID_fkey` FOREIGN KEY (`BUSINESS_CATEGORY_ID`) REFERENCES `business_category`(`BUSINESS_CATEGORY_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `business_2_food_type` ADD CONSTRAINT `business_2_food_type_BUSINESS_ID_fkey` FOREIGN KEY (`BUSINESS_ID`) REFERENCES `business`(`BUSINESS_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `business_2_food_type` ADD CONSTRAINT `business_2_food_type_FOOD_TYPE_ID_fkey` FOREIGN KEY (`FOOD_TYPE_ID`) REFERENCES `food_type`(`FOOD_TYPE_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `city_town` ADD CONSTRAINT `city_town_CITY_ID_fkey` FOREIGN KEY (`CITY_ID`) REFERENCES `city`(`CITY_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `food_menu` ADD CONSTRAINT `food_menu_BUSINESS_ID_fkey` FOREIGN KEY (`BUSINESS_ID`) REFERENCES `business`(`BUSINESS_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `food_menu` ADD CONSTRAINT `food_menu_FOOD_CATEGORY_ID_fkey` FOREIGN KEY (`FOOD_CATEGORY_ID`) REFERENCES `food_category`(`FOOD_CATEGORY_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `food_menu_items` ADD CONSTRAINT `food_menu_items_FOOD_MENU_ID_fkey` FOREIGN KEY (`FOOD_MENU_ID`) REFERENCES `food_menu`(`FOOD_MENU_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `food_menu_items` ADD CONSTRAINT `food_menu_items_MENU_CATEGORY_ID_fkey` FOREIGN KEY (`MENU_CATEGORY_ID`) REFERENCES `menu_category`(`MENU_CATEGORY_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `foodeez_ranking` ADD CONSTRAINT `foodeez_ranking_BUSINESS_ID_fkey` FOREIGN KEY (`BUSINESS_ID`) REFERENCES `business`(`BUSINESS_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_category` ADD CONSTRAINT `menu_category_BUSINESS_ID_fkey` FOREIGN KEY (`BUSINESS_ID`) REFERENCES `business`(`BUSINESS_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `owner_2_business` ADD CONSTRAINT `owner_2_business_BUSINESS_OWNER_ID_fkey` FOREIGN KEY (`BUSINESS_OWNER_ID`) REFERENCES `business_owner`(`BUSINESS_OWNER_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `owner_2_business` ADD CONSTRAINT `owner_2_business_BUSINESS_ID_fkey` FOREIGN KEY (`BUSINESS_ID`) REFERENCES `business`(`BUSINESS_ID`) ON DELETE SET NULL ON UPDATE CASCADE;
