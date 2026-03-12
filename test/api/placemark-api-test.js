import { EventEmitter } from "events";
import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, testPlacemark, testPlacemarks } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("Placemark API tests", () => {
  let user = null;

  setup(async () => {
    placemarkService.clearAuth();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    await placemarkService.deleteAllPlacemarks();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
  });

  teardown(async () => {});

  test("create placemark", async () => {
    testPlacemark.userId = user._id;  // add user to placemark
    let returnedPlacemark;
    try {
    returnedPlacemark = await placemarkService.createPlacemark(testPlacemark);
    } catch (error) {
      console.log("ERROR: ", error.response.data.message);
      throw error;
    }
    // console.log("Returned Placemark: ", returnedPlacemark);
    assert.isNotNull(returnedPlacemark);
    assertSubset(testPlacemark, returnedPlacemark);
    assert.isDefined(returnedPlacemark._id);
  });

  test("get placemark", async () => {
    testPlacemark.userId = user._id;
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
      testPlacemarks[i].userId = user._id;
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPlacemark(testPlacemarks[i]);
    }
    const returnedPlacemarks = await placemarkService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length);
  });

  test("update placemark", async () => {
    testPlacemark.userId = user._id;
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
      userId: user._id,
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
        const returnedPlacemark = await placemarkService.getPlacemark(placemark.id);
        assert.fail("Should not return a response");
      } catch (error) {
        assert(error.response.data.message === "No Placemark with this id", "Incorrect Response Message");
      }
    });

    test("delete multiple placemarks", async () => {
      for (let i = 0; i < testPlacemarks.length; i += 1) {
        testPlacemarks[i].userId = user._id;
        // eslint-disable-next-line no-await-in-loop
        await placemarkService.createPlacemark(testPlacemarks[i]);
      }
      let returnedLists = await placemarkService.getAllPlacemarks();
      assert.equal(returnedLists.length, testPlacemarks.length);
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

    test("Delete All Placemarks", async () => {
      for (let i = 0; i < testPlacemarks.length; i += 1) {
        testPlacemarks[i].userId = user._id;
        // eslint-disable-next-line no-await-in-loop
        await placemarkService.createPlacemark(testPlacemarks[i]);
      }
      let allPlacemarks = await placemarkService.getAllPlacemarks();
      assert.equal(allPlacemarks.length, testPlacemarks.length);
      
      await placemarkService.deleteAllPlacemarks();
      
      allPlacemarks = await placemarkService.getAllPlacemarks();
      assert.equal(allPlacemarks.length, 0);
    });
  });
