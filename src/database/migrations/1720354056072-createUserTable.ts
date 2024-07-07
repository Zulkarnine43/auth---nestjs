import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1720354056072 implements MigrationInterface {
    name = 'CreateUserTable1720354056072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('admin', 'customer', 'staff') NOT NULL, \`avatar\` varchar(255) NULL, \`first_name\` varchar(255) NULL, \`last_name\` varchar(255) NULL, \`email\` varchar(255) NULL, \`phone\` varchar(40) NULL, \`gender\` enum ('male', 'female', 'other') NULL, \`password\` varchar(255) NULL, \`status\` enum ('active', 'inactive', 'disabled', 'on review') NOT NULL DEFAULT 'active', \`facebook_key\` varchar(255) NULL, \`gmail_key\` varchar(255) NULL, \`apple_key\` varchar(255) NULL, \`admin_type\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
