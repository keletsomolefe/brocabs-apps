import { Configuration } from "@brocabs/client";
import CookieManager from "@react-native-cookies/cookies";

export function createNativeConfiguration(basePath: string) {
  return new Configuration({
    basePath,
    credentials: "omit",
    middleware: [
      {
        post: async (response) => {
          const setCookieHeader = response.response.headers.get("set-cookie");

          if (setCookieHeader) {
            await CookieManager.setFromResponse(basePath, setCookieHeader);
          }
        },
        pre: async (request) => {
          const cookies = await CookieManager.get(basePath);
          const cookie = Object.values(cookies)
            .map((c) => `${c.name}=${c.value}`)
            .join("; ");

          request.init.headers = {
            ...request.init.headers,
            Cookie: cookie,
          };
        },
      },
    ],
  });
}
