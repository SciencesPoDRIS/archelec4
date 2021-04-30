import * as assert from "assert";
import { config } from "../../src/config";
import { InternetArchive } from "../../src/services/internet-archive";

const service: InternetArchive = new InternetArchive();

describe("Testing Service InternetArchive", function () {
  this.timeout(10000);

  it("getMetadata should work", async () => {
    const data = await service.getMetadata("EL069_L_1973_03_094_07_2_PF_01");
    assert.equal(data.dir, "/34/items/EL069_L_1973_03_094_07_2_PF_01");
  });

  it("getCollectionIds should work", async () => {
    const data = await service.getCollectionIds(config.internet_archive_collection, {
      from: new Date(),
      to: new Date(),
    });
    assert.equal(data.length >= 0, true);
  });
});
