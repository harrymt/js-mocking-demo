"use strict";

module.exports = database => {
    return {
        database,

        /**
         * Adds `user` to store.
         * @param {object} user to add.
         * @param {function} callback triggered after user has been added to store.
         * @throws Error if `user` input is undefined or not an object.
         * @returns {array} new users array.
         */
        addUser: (user, callback) => {
            if (user === undefined || typeof user !== "object") {
                throw new Error("Cannot add user, input user is invalid.");
            }
            const newUsers = [...database.getUsers(), user];
            database.setUsers(newUsers, callback);
        },

        /**
         * Removes user from store with `id`.
         * @param {number} id of user to remove.
         * @param {function} callback triggered after user has been removed from store.
         * @throws Error if `id` is not a number or is undefined.
         * @returns {array} users array after removal.
         */
        removeUser: (id, callback) => {
            if (id === undefined || typeof id !== "number") {
                throw new Error("Cannot remove user, input id is invalid.");
            }
            const newUsers = database.getUsers().filter(user => user.id !== id);
            database.setUsers(newUsers, callback);
        }
    }
};
