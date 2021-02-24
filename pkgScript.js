async function pkgScript() {
    const execa = require('execa');
    const cpy = require('cpy');
    const fs = require('fs-extra')
    try {
        process.chdir("frontend")
        const isNodeModules = await fs.pathExists('node_modules');
        if(!isNodeModules){
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
            await cpy(addons, './dist');
        }
        if (directories.length) {
            directories.forEach((source) => {
                const paths = source.split('/');
                fs.copy(source, "./dist/" + paths[paths.length - 1], (err) => {
                    console.log(err);
                })
            })
        }
    } catch (err) {
        console.log(err);
    }


};

pkgScript();

