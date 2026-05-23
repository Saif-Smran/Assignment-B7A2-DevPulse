import { Pool } from "pg"
import config from "../config"

export const pool = new Pool({
    connectionString: config.connectionString
})

export const initDB = async () => {
    try {

        // USERS TABLE
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT NOT NULL,

                role VARCHAR(20) DEFAULT 'contributor'
                CHECK (role IN ('contributor', 'maintainer')),

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // ISSUES TABLE
        await pool.query(`
            CREATE TABLE IF NOT EXISTS issues (
                id SERIAL PRIMARY KEY,

                title VARCHAR(150) NOT NULL,

                description TEXT NOT NULL
                CHECK (LENGTH(description) >= 20),

                type VARCHAR(20) NOT NULL
                CHECK (type IN ('bug', 'feature_request')),

                status VARCHAR(20) DEFAULT 'open'
                CHECK (status IN ('open', 'in_progress', 'resolved')),

                reporter_id INTEGER NOT NULL,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (reporter_id)
                REFERENCES users(id)
                ON DELETE CASCADE
            );
        `);

        console.log('Database initialized successfully');

    } catch (error) {
        console.error('Error initializing database:', error);
    }
};