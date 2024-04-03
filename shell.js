/* eslint-disable no-unused-vars */
/**
 * ==== wwebjs-shell ====
 * Used for quickly testing library features
 *
 * Running `npm run shell` will start WhatsApp Web with headless=false
 * and then drop you into Node REPL with `client` in its context.
 */

const repl = require('repl');

const { Client, LocalAuth, MessageMedia } = require('./index');

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const client = new Client({
    puppeteer: { headless: false,
        executablePath: executablePath,
        args: [
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--deterministic-fetch',
            '--disable-features=IsolateOrigins',
            '--disable-site-isolation-trials',
        ],
    },
    authStrategy: new LocalAuth(),
});

console.log('Initializing...');

client.initialize();

client.on('qr', () => {
    console.log('Please scan the QR code on the browser.');
});

client.on('authenticated', (session) => {
    console.log(JSON.stringify(session));
});

client.on('ready', () => {
    const shell = repl.start('wwebjs> ');
    shell.context.client = client;

    const to = '5511988131269@c.us';
    const video = {
        to: to,
        from: '551156796980',
        type: 'video',
        url: 'http://localhost:8000/whatsapp/communication/file/5cb3c779-36e3-45a8-b2d6-aa4a733e048a.stp',
        caption: '',
        filename: 'lalala.mp4'
    };
    MessageMedia.fromUrl(video.url, {unsafeMime: true}).then((media) => {
        console.log('media', media);
        client.sendMessage(video.to, media, {sendMediaAsDocument: true, caption: video.caption });
        client.sendMessage(to, 'olá');
    });
      
    shell.on('exit', async () => {
        await client.destroy();
    });
});
