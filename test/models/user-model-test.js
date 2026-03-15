import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { assertSubset } from "../test-utils.js";
import { freshUser, maggie, testUsers } from "../fixtures.js";

suite("User Model tests", () => {

  suiteSetup( () => {
    db.init("mongo");
  });

  setup(async () => {
    // db.init("mongo");
    await db.userStore.deleteAll();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await db.userStore.addUser(testUsers[i]);
    }
  });

  test("create a user", async () => {
    const newUser = await db.userStore.addUser(maggie);
    assertSubset(maggie, newUser);
  });

  test("delete all userApi", async () => {
    let returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await db.userStore.deleteAll();
    returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });

  test("get a user - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const returnedUser1 = await db.userStore.getUserById(user._id);
    assert.deepEqual(user, returnedUser1);
    const returnedUser2 = await db.userStore.getUserByEmail(user.email);
    assert.deepEqual(user, returnedUser2);
  });

  test("update a user - success", async () => {
    const user = testUsers[0];
    const updatedData = {
      firstName: "UpdatedFirstName",
      lastName: "UpdatedLastName",
      email: "newmail@mail.com",
      password: "newpassword",
    };
    const updatedUser = await db.userStore.updateUser(user._id, updatedData);
    assert.equal(updatedData.firstName, updatedUser.firstName);
    assert.equal(updatedUser.email, "newmail@mail.com")
  });

  test("update a user - fail", async () => {
    const updatedData = {
      firstName: "UpdatedFirstName",
      lastName: "UpdatedLastName",
      email: "newmail@mail.com",
      password: "newpassword",
    };
    const updatedUser = await db.userStore.updateUser("661699999999999999999999", updatedData);
    assert.isNull(updatedUser);
  });

  test("delete One User - success", async () => {
    await db.userStore.deleteUserById(testUsers[0]._id);
    const returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length - 1);
    const deletedUser = await db.userStore.getUserById(testUsers[0]._id);
    assert.isNull(deletedUser);
  });

  test("get a user - failures", async () => {
    const noUserWithId = await db.userStore.getUserById("661699999999999999999999");
    assert.isNull(noUserWithId);
    const noUserWithEmail = await db.userStore.getUserByEmail("no@one.com");
    assert.isNull(noUserWithEmail);
    assert.isNull(await db.userStore.getUserById());
  });

  test("get a user - bad params", async () => {
    let nullUser = await db.userStore.getUserByEmail("");
    assert.isNull(nullUser);
    nullUser = await db.userStore.getUserById("");
    assert.isNull(nullUser);
    nullUser = await db.userStore.getUserById();
    assert.isNull(nullUser);
  });

  test("delete One User - fail", async () => {
    await db.userStore.deleteUserById("bad-id");
    const allUsers = await db.userStore.getAllUsers();
    assert.equal(testUsers.length, allUsers.length);
  });
});
