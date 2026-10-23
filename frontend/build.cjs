const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const esbuild = require("esbuild");
const { createHash } = require("node:crypto");

async function build() {
    const result = spawnSync(process.execPath, [
        require.resolve("typescript/bin/tsc"), "--project", __dirname
    ], { stdio: "inherit" });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error("TypeScript compilation failed");

    function copyResources(directory) {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const source = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                copyResources(source);
            } else if (/\.(html|css)$/.test(entry.name)) {
                const destination = path.join(__dirname, ".build",
                    path.relative(path.join(__dirname, "src"), source));
                fs.mkdirSync(path.dirname(destination), { recursive: true });
                fs.copyFileSync(source, destination);
                const appRoot = path.join(__dirname, "src", "app");
                const relative = path.relative(appRoot, source);
                if (!relative.startsWith("..") && !path.isAbsolute(relative)) {
                    const publicFile = path.join(__dirname, "..", "src", "main", "webapp", relative);
                    fs.mkdirSync(path.dirname(publicFile), { recursive: true });
                    fs.copyFileSync(source, publicFile);
                }
            }
        }
    }
    copyResources(path.join(__dirname, "src"));
    await esbuild.build({
        entryPoints: [path.join(__dirname, ".build", "main.js")],
        outfile: path.join(__dirname, "..", "src", "main", "webapp", "angular-app.js"),
        bundle: true,
        platform: "browser",
        target: ["es2015"],
        loader: { ".html": "text", ".css": "text" },
        minify: true,
        legalComments: "inline"
    });
    const webRoot = path.join(__dirname, "..", "src", "main", "webapp");
    const version = createHash("sha256")
        .update(fs.readFileSync(path.join(webRoot, "angular-app.js")))
        .digest("hex").slice(0, 16);
    const indexFile = path.join(webRoot, "index.html");
    const html = fs.readFileSync(indexFile, "utf8");
    if (!/src="angular-app\.js(?:\?v=[^"]*)?"/.test(html)) {
        throw new Error("index.html must reference angular-app.js");
    }
    fs.writeFileSync(indexFile, html.replace(
        /src="angular-app\.js(?:\?v=[^"]*)?"/g,
        'src="angular-app.js?v=' + version + '"'
    ), "utf8");
    console.log("Built src\\main\\webapp\\angular-app.js (version " + version + ")");
}

build().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
