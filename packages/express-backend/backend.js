import express from "express";

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspiring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  // Ensure that both name and job are provided
  if (name && job) {
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  }
  // If only name is provided, search by name
  else if (name) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  }
  // If neither name nor job are provided, return all users
  else {
    res.send(users);
  }
});

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.send();
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const deleteUser = (id) => {
  const index = users["users_list"].findIndex((user) => user["id"] === id);
  if (index !== -1) {
    users["users_list"].splice(index, 1);
    return true;
  }
  return false;
};

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const result = deleteUser(id);
  if (result) {
    res.status(200).send(`User with id ${id} deleted successfully.`);
  } else {
    res.status(404).send("User not found.");
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
