const fs = require("fs");
const path = require("path");

const iconDir = path.resolve(__dirname, "../src/assets/icons");
const files = fs.readdirSync(iconDir).filter((f) => f.endsWith(".png"));

const content = files
  .map((file) => {
    const name = path.basename(file, ".png");
    const camelName = toCamelCase(name);
    return `export { default as ${camelName} } from './${file}'`;
  })
  .join("\n");

fs.writeFileSync(path.join(iconDir, "index.ts"), content);

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}
