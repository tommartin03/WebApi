#!/usr/bin/env node

const program = require('commander');
const rc = require('rc');
const pkg = require('../package');
const actions = require('../actions');

const config = rc(pkg.name, {
    token: null,
    id: null,
    iconsId: null,
    output: {
        tokens: process.cwd(),
        icons: process.cwd(),
    },
});

program.version(pkg.version);

program
    .command('tokens')
    .description('get tokens from design system')
    .action(() => actions.tokens(config));

program
    .command('icons')
    .description('get icons from design system')
    .action(() => actions.icons(config));

program.parse(process.argv);
