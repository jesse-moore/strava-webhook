import { expect } from "chai";
import * as httpTrigger from "../src/functions/httpTrigger";
import { HttpRequest, InvocationContext } from "@azure/functions";

describe("httpTrigger", () => {
  let context: InvocationContext;
  beforeEach(() => {
    context = new InvocationContext({});
  });
  it("should return a body", async () => {
    const request: HttpRequest = new HttpRequest({
      method: "GET",
      url: "https://example.com",
    });

    const response = await httpTrigger.httpTrigger(request, context);
    expect(response.body).exist;
    expect(response.body).to.equal("Hello, world!");
  });

  it("should return a body with given param", async () => {
    const request: HttpRequest = new HttpRequest({
      method: "GET",
      url: "https://example.com",
      query: { name: "bob" },
    });

    const response = await httpTrigger.httpTrigger(request, context);
    expect(response.body).exist;
    expect(response.body).to.equal("Hello, bob!");
  });
});
