import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAll1581102511806 implements MigrationInterface {
  name = "CreateAll1581102511806";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE TABLE `manufacturer` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `phone` varchar(255) NOT NULL, `siret` bigint NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX `IDX_a4687de45b74542072a2656b77` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `owner` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `purchaseDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX `IDX_1edb5a8c7210a79e24e7ea74a5` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `car` (`id` varchar(36) NOT NULL, `price` int NOT NULL, `firstRegistrationDate` datetime NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `manufacturerId` varchar(36) NULL, INDEX `IDX_219df163feb468a934c3a7b24c` (`manufacturerId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `car_owners_owner` (`carId` varchar(36) NOT NULL, `ownerId` varchar(36) NOT NULL, INDEX `IDX_5818acf69e9ebb70cc6cb4e1e1` (`carId`), INDEX `IDX_b4d6f78db6b35824bf3ef0bf81` (`ownerId`), PRIMARY KEY (`carId`, `ownerId`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `car` ADD CONSTRAINT `FK_219df163feb468a934c3a7b24ca` FOREIGN KEY (`manufacturerId`) REFERENCES `manufacturer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `car_owners_owner` ADD CONSTRAINT `FK_5818acf69e9ebb70cc6cb4e1e11` FOREIGN KEY (`carId`) REFERENCES `car`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `car_owners_owner` ADD CONSTRAINT `FK_b4d6f78db6b35824bf3ef0bf815` FOREIGN KEY (`ownerId`) REFERENCES `owner`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `car_owners_owner` DROP FOREIGN KEY `FK_b4d6f78db6b35824bf3ef0bf815`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `car_owners_owner` DROP FOREIGN KEY `FK_5818acf69e9ebb70cc6cb4e1e11`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `car` DROP FOREIGN KEY `FK_219df163feb468a934c3a7b24ca`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_b4d6f78db6b35824bf3ef0bf81` ON `car_owners_owner`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_5818acf69e9ebb70cc6cb4e1e1` ON `car_owners_owner`",
      undefined
    );
    await queryRunner.query("DROP TABLE `car_owners_owner`", undefined);
    await queryRunner.query(
      "DROP INDEX `IDX_219df163feb468a934c3a7b24c` ON `car`",
      undefined
    );
    await queryRunner.query("DROP TABLE `car`", undefined);
    await queryRunner.query(
      "DROP INDEX `IDX_1edb5a8c7210a79e24e7ea74a5` ON `owner`",
      undefined
    );
    await queryRunner.query("DROP TABLE `owner`", undefined);
    await queryRunner.query(
      "DROP INDEX `IDX_a4687de45b74542072a2656b77` ON `manufacturer`",
      undefined
    );
    await queryRunner.query("DROP TABLE `manufacturer`", undefined);
  }
}
