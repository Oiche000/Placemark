import { EventEmitter } from "events";
import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, mozart, testPlaylists } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("Playlist API tests", () => {
  let user = null;

  setup(async () => {
    placemarkService.clearAuth();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    await placemarkService.deleteAllPlaylists();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    mozart.userid = user._id;
  });

  teardown(async () => {});

  test("create playlist", async () => {
    const returnedPlaylist = await placemarkService.createPlaylist(mozart);
    assert.isNotNull(returnedPlaylist);
    assertSubset(mozart, returnedPlaylist);
  });

  test("delete a playlist", async () => {
    const playlist = await placemarkService.createPlaylist(mozart);
    const response = await placemarkService.deletePlaylist(playlist._id);
    assert.equal(response.status, 204);
    try {
      const returnedPlaylist = await placemarkService.getPlaylist(playlist.id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Playlist with this id", "Incorrect Response Message");
    }
  });

  test("create multiple playlists", async () => {
    for (let i = 0; i < testPlaylists.length; i += 1) {
      testPlaylists[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPlaylist(testPlaylists[i]);
    }
    let returnedLists = await placemarkService.getAllPlaylists();
    assert.equal(returnedLists.length, testPlaylists.length);
    await placemarkService.deleteAllPlaylists();
    returnedLists = await placemarkService.getAllPlaylists();
    assert.equal(returnedLists.length, 0);
  });

  test("remove non-existant playlist", async () => {
    try {
      const response = await placemarkService.deletePlaylist("not an id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Playlist with this id", "Incorrect Response Message");
    }
  });
});