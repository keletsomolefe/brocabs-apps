const camelCase = require("lodash/camelCase");
const fs = require("node:fs");

const ICONS_FOLDER = "./src/assets/icons";
const EXTENSION = ".svg";

let files = [];

if (fs.existsSync(ICONS_FOLDER)) {
  files = files.concat(
    fs.readdirSync(ICONS_FOLDER).filter((filename) => {
      return filename.includes(EXTENSION);
    })
  );
}

const importList = [];
const exportList = [];

for (const file of files) {
  const importName = file.split(EXTENSION)[0];

  importList.push(`import ${camelCase(importName)} from '~/assets/icons/${file}';`);
  exportList.push(`  '${importName}': ${camelCase(importName)}`);
}

const res = `
/**
 * Provides our SVG icon assets
 */
${importList.join("\n")}
export const icons = {
${exportList.join(",\n")},
};
`;

fs.writeFileSync("./src/theme/svg-icons.ts", res);
