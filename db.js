
let privateUsers = [];

const getUsers = () => {
    console.log("Connecting to complex database...");
    return privateUsers;
};

const setUsers = (newUsers, callback) => {
    console.log("Connecting to complex database...");
    privateUsers = newUsers;
    return callback(newUsers);
}

module.exports = {
    setUsers,
    getUsers
};
