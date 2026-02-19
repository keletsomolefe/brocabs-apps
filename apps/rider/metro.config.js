const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

module.exports = (() => {
  const projectRoot = __dirname;
  const config = getDefaultConfig(projectRoot);
  const workspaceRoot = path.resolve(projectRoot, "../..");

  config.watchFolders = [workspaceRoot];

  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules/"),
    path.resolve(workspaceRoot, "node_modules/"),
  ];

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  config.resolver.sourceExts.push("mjs", "svg");

  return config;
})();
