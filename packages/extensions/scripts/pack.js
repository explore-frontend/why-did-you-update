/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const rootPath = path.resolve(__dirname, "../");
const outputPath = path.join(rootPath, "ext");
const outputFilePath = path.join(outputPath, "ext.zip");

const loaderHtmlFilePath = path.join(rootPath, "loader.html");
const iconPathFilePath = path.join(rootPath, "icon.png");
const mainifestFilePath = path.join(rootPath, "manifest.json");

const outputGlobPattern = "out/*.js";
const distJSGlobPattern = "dist/**/**.js";
const distCSSGlobPattern = "dist/**/**.css";
const distHTMLGlobPattern = "dist/**/**.html";

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

const output = fs.createWriteStream(outputFilePath);
const archive = archiver("zip");

archive.pipe(output);

archive.file(loaderHtmlFilePath, { name: path.basename(loaderHtmlFilePath) });
archive.file(iconPathFilePath, { name: path.basename(iconPathFilePath) });
archive.file(mainifestFilePath, { name: path.basename(mainifestFilePath) });

archive.glob(outputGlobPattern, { cwd: rootPath });

archive.glob(distJSGlobPattern, { cwd: rootPath });
archive.glob(distCSSGlobPattern, { cwd: rootPath });
archive.glob(distHTMLGlobPattern, { cwd: rootPath });

archive.finalize();
