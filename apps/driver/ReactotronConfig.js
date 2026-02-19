import Reactotron, { devTools, openInEditor } from "reactotron-react-native";

Reactotron.configure({
  name: "Bro Cabs - Rider",
})
  .use(devTools())
  .use(openInEditor())
  .useReactNative({
    networking: {
      // optionally, you can turn it off with false.
      ignoreUrls: /symbolicate/,
    },
    editor: false, // there are more options to editor
    errors: { veto: (stackFrame) => false }, // or turn it off with false
    overlay: false, // just turning off overlay
  })
  .connect();
