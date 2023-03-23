const express = require("express");
const config = require("./db.config");

const db = require("knex")({
  client: "mysql2",
  connection: {
    host: config.HOST,
    port: config.PORT,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE,
  },
});

const cors = require("cors");
const app = express();

const port = process.env.API_PORT;
app.use(express.json());
app.use(cors());

// INIT DB
const TABLE_NAME = "todo";
db.schema.hasTable(TABLE_NAME).then(function(exists) {
  if (!exists) {
    console.log("CREATING TABLE TODO")
    return db.schema.createTable(TABLE_NAME, function(t) {
      t.increments('id').primary();
      t.string('title', 100);
      t.text('description');
      t.date('due_date')
      t.boolean('done');
    });
  }
});

app.get("/todos", async (req, res) => {
  const todos = await db.select().table(TABLE_NAME);
  res.send(todos)
});

app.post("/todos", async (req, res) => {
  const body = req.body;
  if(!body.title || !body.description || !body.due_date) {
    res.status(400).send({error: "Missing required fields"});
    return;
  }
  const todo = {
    title: body.title,
    description: body.description,
    due_date: body.due_date,
    done: false,
  }
  try {
    const result = await db(TABLE_NAME).insert(todo);
    res.send(result);
  } catch (e) {
    console.error(e)
    res.status(500).send({error: "Internal server error", e});
  }
});

app.delete("/todos/:todoId", async (req, res) => {
  const todoId = req.params.todoId;
  try {
    await db(TABLE_NAME).where({id: todoId}).del()
    res.send({success: true});
  } catch (e) {
    console.error(e)
    res.status(500).send({error: "Internal server error", e});
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
