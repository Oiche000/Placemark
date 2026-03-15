import { EventEmitter } from "events";
import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, testPlacemark, testPlacemarks, adminUser, adminCredentials } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("Placemark API tests", () => {
  let user = null;
  const placemarks = new Array(testPlacemarks.length);

  setup(async () => {
    placemarkService.clearAuth();
    user = await placemarkService.createUser(adminUser);
    await placemarkService.authenticate(adminCredentials);
    await placemarkService.deleteAllPlacemarks();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
  });

  teardown(async () => {});

  test("create placemark", async () => {
    let returnedPlacemark;
    try {
    returnedPlacemark = await placemarkService.createPlacemark(testPlacemark);
    } catch (error) {
      console.log("ERROR: ", error.response.data.message);
      throw error;
    }
    assert.isNotNull(returnedPlacemark);
    assertSubset(testPlacemark, returnedPlacemark);
    assert.isDefined(returnedPlacemark._id);
    assert.equal(returnedPlacemark.userId, user._id);
  });

  test("get placemark", async () => {
    const placemark = await placemarkService.createPlacemark(testPlacemark);
    const returnedPlacemark = await placemarkService.getPlacemark(placemark._id);
    assert.deepEqual(returnedPlacemark, placemark);
  });

  test("get placemark - fail", async () => {
    try {
      await placemarkService.getPlacemark("123456789");
      assert.fail("Should not return a response");
    } catch (error) {
      assert.equal(error.response.data.message, "No Placemark with this id");
      assert.equal(error.response.status, 404);
    }
  });

  test("Get multiple placemarks", async () => {
    for (let i = 0; i < testPlacemarks.length; i += 1) {

      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPlacemark(testPlacemarks[i]);
    }
    const returnedPlacemarks = await placemarkService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length);
  });

  test("update placemark", async () => {
    const placemark = await placemarkService.createPlacemark(testPlacemark);
    const updatedData = {
      name: "Updated Name",
      description: "Updated Description",
      lat: 40.7128,
      lng: -74.0060,
      category: "Camping",
      // amenities: ["Updated Amenities"],
      timeRequired: "2 hours",
      image: "updated-image.jpg",
      // userId: user._id,
    };
    const updatedPlacemark = await placemarkService.updatePlacemark(placemark._id, updatedData);
    assert.isNotNull(updatedPlacemark);
    assert.equal(updatedPlacemark.name, updatedData.name);
    });

    test("delete a placemark", async () => {
      const placemark = await placemarkService.createPlacemark(testPlacemark);
      const response = await placemarkService.deletePlacemarkById(placemark._id);
      assert.equal(response.status, 204);
      try {
        /* const returnedPlacemark =  */await placemarkService.getPlacemark(placemark._id);
        assert.fail("Should not return a response");
      } catch (error) {
        assert(error.response.data.message === "No Placemark with this id", "Incorrect Response Message");
      }
    });

    test("delete all placemarks - success admin user", async () => {
      try {
        await placemarkService.deleteAllPlacemarks();
        assert.fail("Should not allow non-admin user to delete all placemarks");
      } catch (error) {
        assert.equal(error.response.data.statusCode, 403);
        assert.equal(error.response.data.message, "Only administrators can perform this action");
      }
    });

    test("delete all placemarks - fail regular user", async () => {
      for (let i = 0; i < testPlacemarks.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await placemarkService.createPlacemark(testPlacemarks[i]);
      }
      let returnedLists = await placemarkService.getAllPlacemarks();
      assert.equal(returnedLists.length, testPlacemarks.length);
      await placemarkService.createUser(adminUser);
      await placemarkService.authenticate(adminCredentials);
      await placemarkService.deleteAllPlacemarks();
      returnedLists = await placemarkService.getAllPlacemarks();
      assert.equal(returnedLists.length, 0);
    });

    test("delete a placemark  - fail (bad ID)", async () => {
      try {
        const response = await placemarkService.deletePlacemarkById("123456789");
        assert.fail("Delete should have thrown error for bad ID");
      } catch (error) {
        assert(error.response.data.message === "No Placemark with this id", "Incorrect Response Message");
      }
    });

    test("remove non-existant placemark", async () => {
      try {
        const response = await placemarkService.deletePlacemarkById("not an id");
        assert.fail("Should not return a response");
      } catch (error) {
        assert(error.response.data.message === "No Placemark with this id", "Incorrect Response Message");
      }
    });

    test("delete multiple placemarks", async () => {
      for (let i = 0; i < testPlacemarks.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await placemarkService.createPlacemark(testPlacemarks[i]);
      }
      let returnedLists = await placemarkService.getAllPlacemarks();
      assert.equal(returnedLists.length, testPlacemarks.length);

      for (let i = 0; i < returnedLists.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await placemarkService.deletePlacemarkById(returnedLists[i]._id);
      }
      
      // 3. Verify they are all gone
      returnedLists = await placemarkService.getAllPlacemarks();
      assert.equal(returnedLists.length, 0);
    });


  });
