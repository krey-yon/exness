import { Client } from "pg";

const client = new Client({
  connectionString: "postgresql://postgres:password@localhost:5432/postgres",
});

export default client;