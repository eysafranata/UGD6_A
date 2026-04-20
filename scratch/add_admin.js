const postgres = require('postgres');
const bcrypt = require('bcrypt');

async function addAdmin() {
    if (!process.env.POSTGRES_URL) {
        console.log("MISSING URL");
        return;
    }
    const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        console.log("Inserting admin...");
        await sql`
            INSERT INTO users (name, email, password, role, phone)
            VALUES ('admin', 'admin@kirimaja.com', ${hashedPassword}, 'Admin', '08123456789')
            ON CONFLICT (email) DO UPDATE 
            SET role = 'Admin', password = ${hashedPassword};
        `;
        console.log("Admin account (admin / admin123) successfully added/updated.");

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await sql.end();
    }
}

addAdmin().catch(console.error);
