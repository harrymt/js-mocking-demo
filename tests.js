"use strict";

const {
    assert,
    spy,
    stub,
    createSandbox
} = require("sinon");

const database = require("./src/db");
const store = require("./src/store")(database);

// Sample user data
const harry = {id: 0, name: "Harry"};
const john =  {id: 1, name: "John"};

/**
 * Stubs:
 *
 * Replace calls to databases or network requests.
 * Stubbing (replacing) *some* of the functionality.
 *
 * Pros:
 * - Replace calls to db
 * - Replace network requests with this
 * - Force an error to test error handling
 *
 */
it("very basic stub", () => {
    // Stub database method
    const getUsers = stub(database, "getUsers");

    // Overrides database.getUsers() implementation
    getUsers.onFirstCall().returns([harry, john]);

    // `store.database.getUsers()` returns `[harry, john]`
    assert.match(store.database.getUsers().length, 2)

    // Put method back to normal 'remove stub'
    getUsers.restore();
});


describe("stubs", () => {

    // Cache the stubbed methods
    let load; let save;
    beforeEach(() => {
        // Stub out the database method
        load = stub(database, "getUsers");

        // Overriding implementation
        load.onFirstCall().returns([]);

        // Stub out another database method,
        // but don't override its result
        save = stub(database, "setUsers");
    });

    afterEach(() => {
        // Unset the stubbed methods
        load.restore();
        save.restore();
    });

    it("store starts empty", () => {
        // Stubs the specific method

        // This is an example of a pointless assertion
        // The result is defined above:
        // `load.onFirstCall().returns([]);`
        // There is no need to check the length.
        assert.match(store.database.getUsers().length, 0)
    });

    it("new users can be added to the store", () => {
        const currentUsers = [john];
        const newUser = harry;

        // Can override the initial stubbed method
        load.onFirstCall().returns(currentUsers);

        // Call our method we are testing
        store.addUser(newUser, null);

        // Check that the function `database.setUsers()` was called with
        // our newly added user
        assert.calledWith(save, [...currentUsers, newUser], null);
    });
});

describe("spies", () => {

    /**
     * Spies:
     *
     * Spy on functions and see if they have been called.
     *
     * Pros:
     * - Check if method has been called with certain variables
     * - Check if callbacks have been called, and how many times
     *
     */
    it("check that adding a user returns the updated list of users", () => {
        // Spy on a variable
        // Sinon is now watching this variable
        const callback = spy();

        // Use the variable in our function
        store.addUser(john, callback);

        // Now check that `callback([harry, john])` was called inside of `database.addUser()`
        assert.calledWith(callback, [harry, john]);

        // Now spy on our save method.
        // Spies won't change the method, just tracks when `database.setUsers()` is called
        let save = spy(database, "setUsers");

        // This will now execute the database method
        // Requiring the database to be setup first.
        store.addUser(harry, () => {});

        // Check that our `database.setUsers()` method, was called first.
        assert.calledOnce(save);

        // Revert our spy on `database.setUsers()`
        save.restore();
    });
});


describe("sandpit", () => {
    /**
     * Create a sandpit, and call everything using this pit
     * then you don't have to call `x.restore()`.
     */
    const sandbox = createSandbox();

    let load; let save;
    beforeEach(() => {
        // Call same stubbing functions, but using `sandbox.`
        load = sandbox.stub(database, "getUsers");
        load.onFirstCall().returns([]);

        save = sandbox.stub(database, "setUsers");
        save.onFirstCall().returns(function() { return [harry] });
    });

    // Calls .restore() on load and save.
    afterEach(() => sandbox.restore());

    it("can add only users to the store", () => {
        // Check our method is mocked
        assert.match(database.getUsers().length, 0);
    });
});

it("check that our sandpit works", () => {
    // This will perform database tasks,
    // instead of using our mocks because they are removed
    store.addUser(harry, () => {});
    assert.match(store.database.getUsers().length, 1);
});
