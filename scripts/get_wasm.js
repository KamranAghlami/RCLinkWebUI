const path = require('path');
const axios = require('axios');
const fs = require('fs');
const tar = require('tar');

const GITHUB_RELEASES_URL = `https://api.github.com/repos/KamranAghlami/RCLinkApp/releases/latest`;
const OUTPUT_DIRECTORY = path.join(__dirname, '../public/wasm');

function is_directory_empty(path) {
    const files = fs.readdirSync(path);

    if (files.length === 0)
        return true;

    if (files.length === 1 && files[0] === '.gitkeep')
        return true;

    return false;
}

async function download_file(url, output) {
    const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'stream'
    });

    const writer = fs.createWriteStream(output);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function extract_file(file_path, output_directory) {
    await tar.x({
        file: file_path,
        cwd: output_directory
    });
}

async function main() {
    try {
        if (!fs.existsSync(OUTPUT_DIRECTORY))
            fs.mkdirSync(OUTPUT_DIRECTORY);

        if (is_directory_empty(OUTPUT_DIRECTORY)) {
            const response = await axios.get(GITHUB_RELEASES_URL);

            for (const asset of response.data.assets) {
                const file_path = path.join(OUTPUT_DIRECTORY, asset.name);

                await download_file(asset.browser_download_url, file_path);

                if (asset.name.endsWith('.tar.gz')) {
                    await extract_file(file_path, OUTPUT_DIRECTORY);

                    fs.unlinkSync(file_path);
                }
            }
        }
    } catch (error) {
        console.error('[main] error:', error.message);
    }
}

main();
