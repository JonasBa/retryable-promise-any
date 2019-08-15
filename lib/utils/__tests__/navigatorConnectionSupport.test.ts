import getNavigatorConnectionAPI, {
  DEFAULT_CONNECTION_API
} from "./../navigatorConnectionSupport";

describe("getNavigatorConnectionAPI", () => {
  describe("support", () => {
    it("is supported", () => {
      ["connection", "mozConnection", "webkitConnection"].map(vendorAPI => {
        const navigator: any = {
          [vendorAPI]: DEFAULT_CONNECTION_API
        };

        expect(getNavigatorConnectionAPI(navigator)).toBeTruthy();
      });
    });

    it("is not supported", () => {
      expect(getNavigatorConnectionAPI({} as any)).toEqual(
        DEFAULT_CONNECTION_API
      );
    });
  });

  describe("defaults", () => {
    Object.keys(DEFAULT_CONNECTION_API).map(property => {
      describe(property, () => {
        it("respects value", () => {
          const connectionAPI = {
            ...DEFAULT_CONNECTION_API,
            [property]: "notUndefined"
          };

          expect(
            getNavigatorConnectionAPI({ connection: connectionAPI } as any)[
              property
            ]
          ).toEqual(connectionAPI[property]);
        });

        it("copies default", () => {
          const connectionAPI = {
            ...DEFAULT_CONNECTION_API,
            [property]: undefined
          };

          expect(
            getNavigatorConnectionAPI({ connection: connectionAPI } as any)[
              property
            ]
          ).toEqual(DEFAULT_CONNECTION_API[property]);
        });
      });
    });
  });
});
