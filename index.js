
const db = require("./db");


const start = () => {
    const store = require("./store")(db);
    const harry = {id: 0, name: "Harry"};
    const john =  {id: 1, name: "John"};
    store.addUser(harry, users => console.log("After adding", users));
    store.removeUser(harry.id, users => console.log("After removing", users));

    store.removeUser(john.id, users => console.log("After removing", users));

    // etc
    console.log("Users store", store.database.getUsers());
    console.log("Finished running program");
};

start();
