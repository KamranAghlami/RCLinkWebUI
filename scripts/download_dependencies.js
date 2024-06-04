const path = require('path');
const axios = require('axios');
const fs = require('fs');
const tar = require('tar');

const GITHUB_RELEASES_URL = `https://api.github.com/repos/KamranAghlami/RCLinkApp/releases/latest`;
const OUTPUT_DIRECTORY = path.join(__dirname, '../public/wasm');

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
        const response = await axios.get(GITHUB_RELEASES_URL);

        for (const asset of response.data.assets) {
            const file_url = asset.browser_download_url;
            const file_name = path.basename(file_url);
            const file_path = path.join(OUTPUT_DIRECTORY, file_name);

            await download_file(file_url, file_path);

            if (file_name.endsWith('.tar.gz')) {
                await extract_file(file_path, OUTPUT_DIRECTORY);

                fs.unlinkSync(file_path);
            }
        }
    } catch (error) {
        console.error('[main] error:', error.message);
    }
}

main();
