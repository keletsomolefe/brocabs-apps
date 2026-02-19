import { ConfigPlugin, withDangerousMod } from "expo/config-plugins";
import { promises as fs } from "fs";
import path from "path";

/**
 * Expo config plugin to set iOS deployment target in Podfile
 * This ensures the deployment target persists across prebuild runs
 */
const withIosDeploymentTarget: ConfigPlugin<{
  deploymentTarget?: string;
}> = (config, { deploymentTarget = "12.0" } = {}) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, "Podfile");

      try {
        let podfileContent = await fs.readFile(podfilePath, "utf-8");

        if (podfileContent.includes("IPHONEOS_DEPLOYMENT_TARGET")) {
          return config;
        }

        const postInstallRegex = /(react_native_post_install\([\s\S]*?,?\s*\))(\s*)(end)/;

        if (postInstallRegex.test(podfileContent)) {
          podfileContent = podfileContent.replace(
            postInstallRegex,
            `$1$2
    installer.generated_projects.each do |project|
      project.targets.each do |target|
        target.build_configurations.each do |config|
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${deploymentTarget}'
        end
      end
    end
  $3`
          );

          await fs.writeFile(podfilePath, podfileContent, "utf-8");
        }
      } catch (error) {
        console.warn(`Warning: Could not modify Podfile for iOS deployment target: ${error}`);
      }

      return config;
    },
  ]);
};

export default withIosDeploymentTarget;
