import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5433),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
});








// import { DataSource } from 'typeorm';
// import * as dotenv from 'dotenv';

// dotenv.config();

// export default new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   entities: ['src/**/*.entity{.ts,.js}'],
//   migrations: ['src/migrations/*{.ts,.js}'],
//   synchronize: false,
// });



// import { DataSource } from 'typeorm';
// import * as dotenv from 'dotenv';

// dotenv.config({ override: true });

// export default new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: Number(process.env.DB_PORT || 5433),
//   username: process.env.DB_USERNAME || 'pta_user',
//   password: process.env.DB_PASSWORD || 'pta_password',
//   database: process.env.DB_NAME || 'pta_db',
//   entities: ['src/**/*.entity{.ts,.js}'],
//   migrations: ['src/migrations/*{.ts,.js}'],
//   synchronize: false,
// });