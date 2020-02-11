module.exports = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "admin",
    database: "car-data-center",
    charset: "utf8mb4",
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/mysql/migration/*.js"],
    synchronize: false,
    keepConnectionAlive: true,
    cli: {
        entitiesDir: "src/**/*.entity.ts",
        migrationsDir: "src/mysql/migration"
    },
    connectTimeout: 180000
}