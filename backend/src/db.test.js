import mysql from "mysql2/promise";
import "dotenv/config";

const { MY_SQL, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB } = process.env;

const tryConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      // DB Info
    });
    const [rows] = await connection.query("SELECT NOW() AS agora");
    console.log("Conectando ao MySQL - Data/Hora:", rows[0].agora);
    await connection.end();
  } catch (err) {
    console.error("There was an error: " + err.message);
  }
};

export default tryConnection;
