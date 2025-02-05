const fs = require('fs-extra');
const path = require('path');
const Figma = require('figma-js');
const colorString = require('color-string');
const { camelCase } = require('change-case');
const chalk = require('chalk');
const Spinner = require('../helpers/spinner');
const header = require('../helpers/header');

const flatten = (arr = []) => arr.reduce((a, b) => ([
    ...a,
    b,
    ...flatten(b.children),
]), []);

const mapColors = (children, dictionary) => {
    const layers = children.filter(({ styles }) => styles && styles.fill);
    // иногда прилетает стиль которого нет в словаре "#000000"
    const colors = dictionary.filter(({ name, styleType }) => styleType === 'FILL' && name.indexOf('#') === -1);
    const extendedDictionary = colors.map(style => {
        const layer = layers.find(({ styles }) => styles.fill === style.id);

        // todo gradient
        if (!layer || layer.fills.length > 1) return null;

        const { fills } = layer;
        const { r, g, b, a } = fills[0].color;
        const rgba = [r, g, b].map(v => v * 255).concat([a]);
        const color = colorString.to.rgb(rgba);

        return {
            ...style,
            value: color,
        };
    }).filter(Boolean);

    return extendedDictionary.reduce((map, style) => {
        map[camelCase(style.name)] = style.value;
        return map;
    }, {});
};

const mapTypography = (children, dictionary) => {
    const layers = children.filter(({ styles }) => styles && styles.text);
    const typography = dictionary.filter(({ styleType }) => styleType === 'TEXT');
    const extendedDictionary = typography.map(style => {
        const layer = layers.find(({ styles }) => styles.text === style.id);

        if (!layer) return null;

        const {
            fontFamily,
            // fontPostScriptName,
            fontWeight,
            fontSize,
            // textAlignHorizontal,
            // textAlignVertical,
            letterSpacing,
            lineHeightPx,
            // lineHeightPercent,
            // lineHeightPercentFontSize,
            // lineHeightUnit,
        } = layer.style;

        return {
            ...style,
            value: {
                font: `${fontWeight} ${fontSize}px/${lineHeightPx}px ${fontFamily}`,
                letterSpacing,
            },
        };
    }).filter(Boolean);

    return extendedDictionary.reduce((map, style) => {
        map[camelCase(style.name)] = style.value;
        return map;
    }, {});
};

const mapEffects = (children, dictionary) => {
    const layers = children.filter(({ styles }) => styles && styles.effect);
    const effects = dictionary.filter(({ styleType }) => styleType === 'EFFECT');
    const extendedDictionary = effects.map(style => {
        const layer = layers.find(({ styles }) => styles.effect === style.id);

        if (!layer) return null;

        const appliedEffects = layer.effects.filter(({ visible }) => visible);
        const value = appliedEffects.map(effect => {
            const { color: { r, g, b, a }, offset, radius } = effect;
            const color = colorString.to.rgb([r, g, b].map(v => v * 255).concat([a]));

            return `${offset.x}px ${offset.y}px ${radius}px ${color}`;
        }).join(', ');

        return {
            ...style,
            value,
        };
    });

    return extendedDictionary.reduce((map, style) => {
        map[camelCase(style.name)] = style.value;
        return map;
    }, {});
};

async function tokens(config) {
    const spinner = new Spinner();

    spinner.start();

    try {
        const client = Figma.Client({ personalAccessToken: config.token });
        const { data } = await client.file(config.id);

        spinner.lastAction();

        const {
            styles = [],
            document: {
                children: tree = [],
            },
        } = data;
        const children = flatten(tree);

        const dictionary = Object.keys(styles).map(id => ({
            id,
            ...styles[id],
        }));

        const colors = mapColors(children, dictionary);
        const typography = mapTypography(children, dictionary);
        const effects = mapEffects(children, dictionary);

        const jsObject = JSON.stringify({ colors, typography, effects }, null, 4).replace(/"(.*?)":/g, '$1:');

        const result = `${header()}
        
const tokens = ${jsObject};

export { tokens };
`;

        fs.outputFileSync(path.join(process.cwd(), config.output.tokens), result);

        spinner.succeed(`Tokens received. ${chalk.gray(`Output into "${path.relative(process.cwd(), config.output.tokens)}"`)}`);
    } catch (e) {
        spinner.fail(e.response.data.err);
    }
}

module.exports = tokens;
