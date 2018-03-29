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


it("basic stub", () => {
    const getUsersStub = stub(stubbedDatabase, "getUsers");
    getUsersStub.onFirstCall().returns([1, 2, 3]);

    assert.match(store.database.getUsers().length, 3)

    getUsersStub.restore(); // Put method back to normal 'remove stub'
});

describe("users store", () => {
    let getter; let setter;
    beforeEach("setup stubs", () => {
        getter = stub(stubbedDatabase, "getUsers");
        getter.onFirstCall().returns([]);
    });

    afterEach("teardown stubs", () => {
        getter.restore();
    });

    // Stubs
    // Replace calls to databases or network requests.
    // Stubbing (replacing) *some* of the functionality.
    //
    // Pros:
    // - Replace calls to db
    // - Replace network requests with this
    // - Force an error to test error handling
    //
    it("starts empty", () => {
        // Stubs the specific method.
        // Not much use
        assert.match(store.database.getUsers().length, 0)
    });

    it("can add a user to the store", () => {
        const save = stub(stubbedDatabase, "setUsers");
        save.yields(null, harry);

        const callback = spy();

        store.addUser(harry, callback);
        save.restore();

        assert.calledWith(callback, null, harry);
    });


    // Basic spy
    it("can add to the store", () => {
        // Won't change the method, just tracks when setUsers() is called
        setter = spy(stubbedDatabase, "setUsers");
        store.addUser(harry, () => {}); // Will do complex database work :(
        setter.restore();
        assert.calledOnce(setter);
    });

    // Spies
    // Only really useful for verifying callbacks after db or io work
    it("issues callback after work has been completed", () => {
        const callback = spy();
        // Will do complex database work :(
        store.addUser(harry, callback); // verify the callback was called
        assert.calledOnce(callback);
    });
});

describe("should be sandboxed", () => {

    const sandbox = createSandbox();

    let getter; let setter;
    beforeEach(() => {
        getter = sandbox.stub(stubbedDatabase, "getUsers");
        getter.onFirstCall().returns([]);

        setter = sandbox.stub(stubbedDatabase, "setUsers");
        setter.onFirstCall().returns(function() { return [harry] });
    });

    // Calls .restore() on getter and setter.
    afterEach(() => sandbox.restore());

    it("can add only users to the store", () => {
        // try and add array, or number
    });
});
