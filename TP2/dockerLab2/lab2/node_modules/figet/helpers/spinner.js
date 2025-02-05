const ora = require('ora');

const texts = [
    'Painting icons',
    'Making some fixtures',
    'Think about the meaning of life',
    'Play with fonts',
    'Stretching fonts',
];

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Spinner {
    constructor() {
        this.ora = ora({ color: 'yellow' });
        this.interval = null;
    }
    start() {
        this.ora.start(texts[random(0, texts.length - 1)]);
        this.interval = setInterval(() => this.ora.text = texts[random(0, texts.length - 1)], 5000);
    }
    lastAction() {
        clearInterval(this.interval);
        this.interval = null;
        this.ora.text = 'Just a moment...';
    }
    fail(text) {
        this.ora.fail(text);
    }
    succeed(text) {
        this.ora.succeed(text);
    }
}

module.exports = Spinner;
