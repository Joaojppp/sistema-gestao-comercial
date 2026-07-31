const app = require('./app');
const pool = require('./config/db');

const PORT = 3001;

async function startServer() {
    try {
        const connection = await pool.getConnection();

        console.log('✅ Conectado ao MYSQL');

        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Erro ao conectar ao MYSQL:', error);
    }
}

startServer();