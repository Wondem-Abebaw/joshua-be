import { MigrationInterface, QueryRunner } from "typeorm";

export class IniitialMigrations1726820503538 implements MigrationInterface {
    name = 'IniitialMigrations1726820503538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "faqs" ("created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying, "archive_reason" text, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "tags" jsonb, CONSTRAINT "PK_2ddf4f2c910f8e8fa2663a67bf0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying, "archive_reason" text, "name" character varying NOT NULL, "email" character varying, "phone_number" character varying NOT NULL, "gender" character varying, "emergency_contact" jsonb, "enabled" boolean NOT NULL DEFAULT true, "profile_image" jsonb, "address" jsonb, CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a3ffb1c0c8416b9fc6f907b743" ON "users" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_17d1817f241f10a3dbafb169fd" ON "users" ("phone_number") `);
        await queryRunner.query(`CREATE TABLE "configurations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying, "archive_reason" text, "global_configurations" jsonb NOT NULL, CONSTRAINT "PK_ef9fc29709cc5fc66610fc6a664" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying, "archive_reason" text, "title" character varying NOT NULL, "body" text NOT NULL, "receiver" uuid, "type" character varying, "employmentType" character varying, "employmentStatus" character varying, "notificationType" character varying, "method" character varying, "is_company" character varying NOT NULL DEFAULT 'all', "is_seen" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying, "archive_reason" text, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "key" character varying NOT NULL, "protected" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_a87cf0659c3ac379b339acf36a2" UNIQUE ("key"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account_roles" ("created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying, "archive_reason" text, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" uuid, "role_id" uuid NOT NULL, CONSTRAINT "PK_d29411fdd88d973ec91cbbd179e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accounts" ("created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying, "archive_reason" text, "id" uuid NOT NULL, "name" character varying NOT NULL, "phone_number" character varying NOT NULL, "email" character varying, "type" character varying NOT NULL, "gender" character varying, "username" character varying, "is_active" boolean NOT NULL, "password" character varying NOT NULL, "fcm_id" character varying, "address" jsonb, "profile_image" jsonb, "verified" boolean NOT NULL DEFAULT false, "notify_me" boolean NOT NULL DEFAULT true, "plan_type_id" uuid, "plan_type_duration" integer NOT NULL DEFAULT '0', "is_paid" boolean NOT NULL DEFAULT false, "is_online" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_31719ad17bc34678f49decea7d" ON "accounts" ("phone_number") `);
        await queryRunner.query(`CREATE INDEX "IDX_477e3187cedfb5a3ac121e899c" ON "accounts" ("username") `);
        await queryRunner.query(`CREATE TABLE "account_permissions" ("created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying, "archive_reason" text, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" uuid, "role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_148a3901b839a6ef45ba05de4ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions" ("created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying, "archive_reason" text, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "key" character varying NOT NULL, CONSTRAINT "UQ_017943867ed5ceef9c03edd9745" UNIQUE ("key"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying, "archive_reason" text, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reset_password_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" text NOT NULL, "email" character varying NOT NULL, "account_id" uuid, "type" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6feef0f35ec9c3da0f22e64da16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying, "archive_reason" text, "model_id" uuid NOT NULL, "model_name" character varying, "user_id" uuid NOT NULL, "action" character varying, "ip" character varying, "old_payload" jsonb, "payload" jsonb, "user" jsonb, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sessions" ("created_by" character varying, "updated_by" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying, "archive_reason" text, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" character varying NOT NULL, "refresh_token" character varying NOT NULL, "token" character varying NOT NULL, "ipAddress" character varying, "user_agent" character varying, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_da0cf19646ff5c6e3c0284468e" ON "sessions" ("account_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c862499023be8feec98129d4e9" ON "sessions" ("refresh_token") `);
        await queryRunner.query(`CREATE INDEX "IDX_e9f62f5dcb8a54b84234c9e7a0" ON "sessions" ("token") `);
        await queryRunner.query(`ALTER TABLE "account_roles" ADD CONSTRAINT "FK_0e94d53a5ed46deaae79475e427" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account_roles" ADD CONSTRAINT "FK_70186a37bf7b84898bd08f61fba" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account_permissions" ADD CONSTRAINT "FK_21707749b5e26ea1d72ff458fc8" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account_permissions" ADD CONSTRAINT "FK_6456ac9c5ea387ff332d1cd3fd3" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account_permissions" ADD CONSTRAINT "FK_7bba5aa59faae241e2816f93d07" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "account_permissions" DROP CONSTRAINT "FK_7bba5aa59faae241e2816f93d07"`);
        await queryRunner.query(`ALTER TABLE "account_permissions" DROP CONSTRAINT "FK_6456ac9c5ea387ff332d1cd3fd3"`);
        await queryRunner.query(`ALTER TABLE "account_permissions" DROP CONSTRAINT "FK_21707749b5e26ea1d72ff458fc8"`);
        await queryRunner.query(`ALTER TABLE "account_roles" DROP CONSTRAINT "FK_70186a37bf7b84898bd08f61fba"`);
        await queryRunner.query(`ALTER TABLE "account_roles" DROP CONSTRAINT "FK_0e94d53a5ed46deaae79475e427"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e9f62f5dcb8a54b84234c9e7a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c862499023be8feec98129d4e9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_da0cf19646ff5c6e3c0284468e"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`DROP TABLE "reset_password_tokens"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "account_permissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_477e3187cedfb5a3ac121e899c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_31719ad17bc34678f49decea7d"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TABLE "account_roles"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "configurations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17d1817f241f10a3dbafb169fd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3ffb1c0c8416b9fc6f907b743"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "faqs"`);
    }

}
