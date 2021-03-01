async function pkgScript() {
    const execa = require('execa');
    const cpy = require('cpy');
    const fs = require('fs-extra');
    const path = require('path');
    try {
        process.chdir("frontend")
        const isNodeModules = await fs.pathExists('node_modules');
        if (!isNodeModules) {
            await execa.command("npm i");
        }
        await execa.command("npm run build");
        process.chdir("../")

        await execa.command("npm run build");
        const { stdout } = await execa('npm', ['run', 'pkg'], { shell: true });
        const lines = stdout.split(/[\r\n]+/);
        const addons = [];
        const directories = [];
        let i = 0;
        while (i < lines.length - 1) {
            const [line, next] = lines.slice(i, i + 2).map(s => s && s.trim());
            i += 1;
            if (
                line && next &&
                line.startsWith('The addon must be distributed') &&
                next.endsWith('.node')
            ) {
                addons.push(next.replace('%1: ', ""));
                // already know the next was match, so skip 2
                i += 1;
            }

            if (line && next && line.startsWith('The directory must be distributed with executable')) {
                directories.push(next.replace('%1: ', ""));
            }
            if (line && next && line.startsWith('The file must be distributed with executable')) {
                addons.push(next.replace('%1: ', ""));
            }
            continue;
        }
        if (addons.length) {
            await cpy(addons, path.join('./dist', "linux"));
        }
        if (directories.length) {
            directories.forEach((source) => {
                const paths = source.split(path.sep);
                fs.copy(source, path.join("./dist/", 'linux', paths[paths.length - 1]), (err) => {
                    console.log(err);
                })
            })
        }
        const namePrefix = "weiboCrawlerTs-";
        fs.copySync(path.join("./dist", 'linux'), path.join("./dist", 'win'));
        fs.moveSync(path.join("./dist", namePrefix + 'win.exe'), path.join("./dist", 'win', namePrefix + 'win.exe'))
        fs.copySync(path.join("./dist", 'linux'), path.join("./dist", 'macos'));
        fs.moveSync(path.join("./dist", namePrefix + 'macos'), path.join("./dist", 'macos', namePrefix + 'macos'))
        fs.moveSync(path.join("./dist", namePrefix + 'linux'), path.join("./dist", 'linux', namePrefix + 'linux'))
    } catch (err) {
        console.log(err);
    }


};

pkgScript();

