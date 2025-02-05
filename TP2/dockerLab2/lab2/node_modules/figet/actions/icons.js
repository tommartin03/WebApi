/**
 * This file is generated automatically
 * on date
 *
 * Do not edit it directly
 */
const fs = require('fs-extra');
const path = require('path');
const Figma = require('figma-js');
const axios = require('axios');
const svgr = require('@svgr/core').default;
const { pascalCase } = require('change-case');
const chalk = require('chalk');
const Spinner = require('../helpers/spinner');
const header = require('../helpers/header');

const template = (
    { template },
    opts,
    { imports, componentName, props, jsx, exports },
) => template.ast`${imports}

const ${componentName} = ${props} => (
    ${jsx}
)

${exports}
`;

module.exports = async (config) => {
    const spin = new Spinner();

    spin.start();

    try {
        const client = Figma.Client({ personalAccessToken: config.token });
        const { data } = await client.fileNodes(config.id, { ids: [config.iconsId] });
        const frame = data.nodes[config.iconsId].document;
        const iconsFrames = frame.children.map(child => {
            if (child.type !== 'COMPONENT') return null;

            return child;
        }).filter(Boolean);
        const ids = iconsFrames.map(({ id }) => id);

        const { data: { images } } = await client.fileImages(config.id, { ids, format: 'svg' });
        const namedIcons = Object.keys(images).map(id => ({
            id,
            name: iconsFrames.find(node => node.id === id).name,
            url: images[id],
        }));

        spin.lastAction();

        const downloads = namedIcons.map(({ id, name, url }) => (
            axios
                .get(url, { responseType: 'blob' })
                .then(({ headers, data }) => svgr(
                    headers['content-length'] > 0 ? data : '<svg />',
                    {
                        icon: true,
                        template,
                        replaceAttrValues: { black: 'currentColor' },
                    },
                    { componentName: pascalCase(name) },
                ))
                .then(code => ({ id, name, code }))
                .catch(e => spin.fail(e.message))
        ));

        const vectors = await Promise.all(downloads);

        vectors.forEach(({ name, code }) => (
            fs.outputFileSync(
                path.join(process.cwd(), config.output.icons, `${pascalCase(name)}.tsx`),
                `${header()}\n\n${code}`,
            )
        ));

        const vectorsDedupe = vectors.reduce((list, icon) => {
            if (list.every(({ name }) => name !== icon.name)) {
                list.push(icon);
            }

            return list;
        }, []);

        fs.outputFileSync(
            path.join(process.cwd(), config.output.icons, 'index.tsx'),
            `${header()}

${vectorsDedupe.map(({ name }) => `import ${pascalCase(name)} from './${pascalCase(name)}';`).join('\n')}

export default {
${vectorsDedupe.map(({ name }) => `    ${pascalCase(name)},`).join('\n')}
};`,
        );

        spin.succeed(`Received ${vectors.length} icons. ${chalk.gray(`Output into "${path.relative(process.cwd(), config.output.icons)}"`)}`);
    } catch (e) {
        spin.fail(e.response.data.err);
    }
};
