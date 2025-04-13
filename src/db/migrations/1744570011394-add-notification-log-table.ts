import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotificationLogTable1744570011394 implements MigrationInterface {
    name = 'AddNotificationLogTable1744570011394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_log_status_enum" AS ENUM('PENDING', 'SUCCESS', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "notification_log" ("id" SERIAL NOT NULL, "eventType" character varying NOT NULL, "recipient" character varying NOT NULL, "channel" character varying NOT NULL, "status" "public"."notification_log_status_enum" NOT NULL, "message" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6f761cfbbd064e0f326960877d6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notification_log"`);
        await queryRunner.query(`DROP TYPE "public"."notification_log_status_enum"`);
    }

}
