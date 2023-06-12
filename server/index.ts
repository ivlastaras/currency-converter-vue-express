import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import basicAuth from 'express-basic-auth';
import sqlite3 from 'sqlite3';

dotenv.config();

if (!process.env.DBSOURCE || !process.env.PORT || !process.env.ADMIN_PASSWORD) {
  process.exit(1);
}

const DBSOURCE: string = process.env.DBSOURCE;
const PORT: number = parseInt(process.env.PORT as string, 10);
const ADMIN_PASSWORD: string = process.env.ADMIN_PASSWORD;

const db = new sqlite3.Database(DBSOURCE);

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json

interface ExchangeRate {
  base: string;
  target: string;
  rate: number;
}

const users: { [key: string]: string } = { admin: ADMIN_PASSWORD };

const authOptions = {
  challenge: true, //it will cause most browsers to show a popup to enter credentials on unauthorized responses,
  users: users, //typically you will get this info from environment variables or any other source
  authorizeAsync: false,
  unauthorizedResponse: () => {
    return 'Unauthorized';
  }
};

app.post('/authenticate', (req, res) => {
  const { username, password } = req.body;
  if (!(typeof username === 'string') || !(typeof password === 'string')) {
    res.status(400).json({ error: 'errors in request body' });
    return;
  }
  if (!(username in users) || !(users[username] == password)) {
    res.status(400).json({ error: 'wrong credentials' });
    return;
  }
  res.status(200).json({username: username, password: password});
  return;
});

app.post('/conversion', (req, res) => {
  const { base, target, amount } = req.body;
  if (
    !(typeof base === 'string') ||
    !(typeof target === 'string') ||
    !(typeof amount === 'number')
  ) {
    res.status(400).json({ error: 'errors in request body' });
    return;
  }
  const sql = 'select * from exchangerate where base = ? AND target = ?';
  const params = [base.toUpperCase(), target.toUpperCase()];
  db.get(sql, params, function (err: Error, entry: ExchangeRate) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: entry.rate * Number(amount)
    });
  });
});

app.get('/exchangerates', (req, res) => {
  const sql = 'select * from exchangerate';
  db.all(sql, function (err: Error, rows: Array<ExchangeRate>) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({
      message: 'success',
      data: rows
    });
  });
});

app.get('/exchangerates/:base/:target', (req, res) => {
  const { base, target } = req.params;
  if (!(typeof base === 'string') || !(typeof target === 'string')) {
    res.status(400).json({ error: 'errors in request params' });
    return;
  }
  const sql = 'select * from exchangerate where base = ? AND target = ?';
  const params = [base.toUpperCase(), target.toUpperCase()];
  db.get(sql, params, function (err: Error, row: ExchangeRate) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({});
      return;
    }
    res.status(200).json({
      message: 'success',
      data: row
    });
  });
});

app.delete(
  '/exchangerates/:base/:target',
  basicAuth(authOptions),
  (req, res) => {
    const { base, target } = req.params;
    if (!(typeof base === 'string') || !(typeof target === 'string')) {
      res.status(400).json({ error: 'errors in request params' });
      return;
    }
    const sql = 'delete from exchangerate where base = ? and target = ?';
    const params = [base.toUpperCase(), target.toUpperCase()];
    db.run(sql, params, function (this: sqlite3.RunResult, err: Error): void {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: 'exchange rate deleted', changes: this.changes });
    });
  }
);

app.patch(
  '/exchangerates/:base/:target',
  basicAuth(authOptions),
  (req, res) => {
    const { rate } = req.body;
    const { base, target } = req.params;
    if (
      !(typeof base === 'string') ||
      !(typeof target === 'string') ||
      !(typeof rate === 'number')
    ) {
      res.status(400).json({ error: 'errors in request params or body' });
      return;
    }
    const sql =
      'update exchangerate set rate = coalesce(?,rate) where base = ? and target = ?';
    const params = [rate, base.toUpperCase(), target.toUpperCase()];
    db.run(sql, params, function (this: sqlite3.RunResult, err: Error): void {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({
        message: 'success',
        changes: this.changes
      });
    });
  }
);

app.post('/exchangerates', basicAuth(authOptions), (req, res) => {
  const { base, target, rate } = req.body;
  if (
    !(typeof base === 'string') ||
    !(typeof target === 'string') ||
    !(typeof rate === 'number')
  ) {
    res.status(400).json({ error: 'errors in request body' });
    return;
  }
  const sql = 'insert into exchangerate (base, target, rate) values (?,?,?)';
  const params = [base.toUpperCase(), target.toUpperCase(), rate];
  db.run(sql, params, function (this: sqlite3.RunResult, err: Error): void {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({
      message: 'success',
      id: this.lastID
    });
  });
});

app.use(function (req, res) {
  res.status(404).json();
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
