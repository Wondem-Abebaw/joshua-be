import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateroomEntity1727185997900 implements MigrationInterface {
    name = 'UpdateroomEntity1727185997900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "roomImage" jsonb`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "enabled" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "price" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "price" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "enabled"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "roomImage"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "description"`);
    }

}
