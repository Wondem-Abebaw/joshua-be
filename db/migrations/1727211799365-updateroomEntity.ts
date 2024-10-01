import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateroomEntity1727211799365 implements MigrationInterface {
    name = 'UpdateroomEntity1727211799365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "status" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "description" SET NOT NULL`);
    }

}
