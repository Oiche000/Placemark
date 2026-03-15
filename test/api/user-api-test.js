import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, freshUser, testUsers, adminUser, adminCredentials } from "../fixtures.js";
import { db } from "../../src/models/db.js";

const users = new Array(testUsers.length);

suite("User API tests", () => {
  setup(async () => {
    placemarkService.clearAuth();
    await placemarkService.createUser(adminUser);
    await placemarkService.authenticate(adminCredentials);
    await placemarkService.deleteAllUsers();
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials );
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      users[i] = await placemarkService.createUser(testUsers[i]);
    }

  });
  teardown(async () => { });

  test("create a user", async () => {
    const newUser = await placemarkService.createUser(freshUser);
    assertSubset(freshUser, newUser);
    assert.isDefined(newUser._id);
  });

  test("update a user", async () => {
    const userToUpdate = users[0];
    const updatedData = {
      firstName: "UpdatedFirstName",
      lastName: "UpdatedLastName",
      email: "updated@test.com",
      password: "updatedpassword",
    };
    const updatedUser = await placemarkService.updateUser(userToUpdate._id, updatedData);
    assert.equal(updatedUser.firstName, updatedData.firstName);
    assert.equal(updatedUser.email, "updated@test.com");

    const newUserFound = await placemarkService.getUser(userToUpdate._id);
    assert.deepEqual(newUserFound, updatedUser);
  });

  test("Admin delete all users - success", async () => {
    await placemarkService.createUser(adminUser);
    await placemarkService.authenticate(adminCredentials);
    let returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 5); // test users + admin user + maggie
    
    await placemarkService.deleteAllUsers();
    await placemarkService.createUser(adminUser);
    await placemarkService.authenticate(adminCredentials);
    returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 1);  
  });

  test("regular user cannot delete all users", async () => {
    try {
      await placemarkService.deleteAllUsers();
      assert.fail("Should not allow non-admin user to delete all users");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 403);
      assert.equal(error.response.data.message, "Only administrators can perform this action");
    }
  });
  
  test("get a user - success", async () => {
    const returnedUser = await placemarkService.getUser(users[0]._id);
    assert.deepEqual(users[0], returnedUser);
  });

  /*   test("get a user - fail", async () => {
    const returnedUser = await placemarkService.getUser("1234");
    assert.isNull(returnedUser);
  }); */

    test("get a user - bad id - fail", async () => {
    try {
      const returnedUser = await placemarkService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 503);  //  or 404 ?
    }
  });

  test("get a user - deleted user", async () => {
    await placemarkService.createUser(adminUser);
    await placemarkService.authenticate(adminCredentials);
    await placemarkService.deleteAllUsers();
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials );
    try {
      const returnedUser = await placemarkService.getUser(users[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("Admin can get all users", async () => {
    await placemarkService.createUser(adminUser);
    await placemarkService.authenticate(adminCredentials);
    const returnedUsers = await placemarkService.getAllUsers();
    
    assert.equal(returnedUsers.length, 5); 
  });

  test("Regular user cannot delete all users", async () => {
    try {
      await placemarkService.deleteAllUsers();
      assert.fail("Maggie should not be able to delete all users");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 403);
      assert.equal(error.response.data.message, "Only administrators can perform this action");
    }
  });

  test("Regular user (Maggie) cannot get all users", async () => {
    try {
      await placemarkService.getAllUsers();
      assert.fail("Maggie should not be able to get all users");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 403);
      assert.equal(error.response.data.message, "Only administrators can access user lists");
    }
  });
});