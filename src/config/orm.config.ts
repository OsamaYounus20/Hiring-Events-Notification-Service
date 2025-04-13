import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/db/entities/**/*.ts'],
  migrations: ['src/db/migrations/*.ts'],
  migrationsTableName: 'notification_migrations',
  synchronize: false,
  migrationsRun: false,
});
