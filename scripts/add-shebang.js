const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "dist", "index.js");
const shebang = "#!/usr/bin/env node\n";

const content = fs.readFileSync(filePath, "utf-8");

if (!content.startsWith("#!")) {
  fs.writeFileSync(filePath, shebang + content);
  console.log("✓ Shebang added to dist/index.js");
} else {
  console.log("✓ Shebang already present");
}
