import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import Database from '@/util/database';

const app = express();

const PORT = parseInt(process.env.PORT!) || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

(async () => {
  const db = new Database();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})().catch((err) => {
  console.error(err.message);
});