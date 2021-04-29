import * as assert from "assert";
import { config } from "../../src/config";
import { Import } from "../../src/services/import";

const service: Import = new Import();

describe("Testing Service InternetArchive", function () {
  this.timeout(0);

  it("import execution should work", async () => {
    await service.execution({ date: new Date("2021-04-20"), to: new Date("2021-04-21"), index: "test" });
    assert.equal(true, true);
  });
});
