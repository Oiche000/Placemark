import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPlacemark, testPlacemarks, maggie, freshUser } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Placemark Model tests", () => {
  let user = null;
  const placemarks = new Array(testPlacemarks.length);

  suiteSetup( () => {
    db.init("mongo");  // in suiteSetup so only run it once
  });

  setup(async () => {
    await db.userStore.deleteAll();
    await db.placemarkStore.deleteAllPlacemarks();

    const uniqueUser = {
      firstName: "Test",
      lastName: "User",
      email: `test${Date.now()}@test.com`, // e.g., test1708453@test.com
      password: "secretpassword"
    };
    
    user = await db.userStore.addUser(maggie);
   // user = await db.userStore.addUser(freshUser2);
    // assert.isDefined(user, "user should have been created");
    // assert.isDefined(user._id, "user must have an _id");

    for (let i = 0; i < testPlacemarks.length; i += 1) {
      
      // eslint-disable-next-line no-await-in-loop
      placemarks[i] = await db.placemarkStore.addPlacemark(user._id, testPlacemarks[i]);
    }
  });

  test("create a placemark", async () => {
    
    const newPlacemark = await db.placemarkStore.addPlacemark(user._id, testPlacemark);
    assertSubset(testPlacemark, newPlacemark);
    assert.isDefined(newPlacemark._id);
  });

  test("delete all placemarks", async () => {
    let returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length);
    await db.placemarkStore.deleteAllPlacemarks();
    returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, 0);
  });

  test("get a placemark - success", async () => {
    const placemark = await db.placemarkStore.addPlacemark(user._id, testPlacemark);
    const returnedPlacemark = await db.placemarkStore.getPlacemarkById(placemark._id);
    assert.deepEqual(placemark, returnedPlacemark);
  });

  test("delete One Placemark - success", async () => {
    await db.placemarkStore.deletePlacemarkById(placemarks[0]._id);
    const returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, placemarks.length - 1);
    const deletedPlacemark = await db.placemarkStore.getPlacemarkById(placemarks[0]._id);
    assert.isNull(deletedPlacemark);
  });

  test("get a placemark - bad params", async () => {
    assert.isNull(await db.placemarkStore.getPlacemarkById(""));
    assert.isNull(await db.placemarkStore.getPlacemarkById());
  });

  test("delete One Placemark - fail", async () => {
    await db.placemarkStore.deletePlacemarkById("661699999999999999999999");
    const allPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(testPlacemarks.length, allPlacemarks.length);
  });

  test("update a placemark - sucess", async () => {
    const placemarkToUpdate = placemarks[0];
    const updatedData = {
      name: "Updated Name",
      description: "Updated Description",
      category: "Hiking",
      lat: 53.0,
      lng: -6.0,
      timeRequired: "1 hour",
      // amenities: "Toilets",
      // userId: user._id
    };
    const updatedPlacemark = await db.placemarkStore.updatePlacemark(placemarkToUpdate._id, updatedData);
    assert.equal(updatedPlacemark.name, updatedData.name);
    assert.equal(updatedPlacemark.description, "Updated Description");
  });

  test("update a placemark - fail", async () => {
    const updatedData = {
      name: "Updated Name",
      description: "Updated Description",
      category: "Hiking",
      lat: 53.0,
      lng: -6.0,
      timeRequired: "1 hour",
      amenities: "Toilets"
    };

    const returnedPlacemark = await db.placemarkStore.updatePlacemark("661699999999999999999999", updatedData);
    assert.isNull(returnedPlacemark);
  });
});