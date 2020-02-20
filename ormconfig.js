module.exports = {
    type: "mysql",
    host: process.env.DB_MYSQL_HOST || "localhost",
    port: process.env.DB_MYSQL_PORT || "3306",
    username: process.env.DB_MYSQL_USER || "root",
    password: process.env.DB_MYSQL_PASSWORD || "admin",
    database: process.env.DB_MYSQL_DATABASE || "car-data-center",
    charset: "utf8mb4",
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/mysql/migration/*.js"],
    synchronize: false,
    keepConnectionAlive: true,
    cli: {
        entitiesDir: "src/**/*.entity.ts",
        migrationsDir: "mysql/migration"
    },
    connectTimeout: 180000
}