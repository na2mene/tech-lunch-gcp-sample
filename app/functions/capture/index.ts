import puppeteer, { Browser, Page } from 'puppeteer';
import { IncomingWebhook } from '@slack/webhook';
import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucketName = 'tech-lunch';

const webhook = new IncomingWebhook(
  process.env.INCOMING_WEB_HOOK
  || '',
);

/**
 * Background Cloud Function to be triggered by Pub/Sub.
 * This function is exported by index.js, and executed when
 * the trigger topic receives a message.
 *
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
const uploadScreenCaptureToGCS = async (message: any, context: any) => {
  const data = message.data
    ? Buffer.from(message.data, 'base64').toString() : '';

  console.log(`pubsubからのデータ: ${data}`)

  const browser: Browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const filePath = '/tmp/screenshot.png'
  try {
    const page: Page = await browser.newPage();
    page.setViewport({width: 1200, height: 800})
    await page.goto('https://www.citymobile.co.jp/rent/1210/');
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`[uploadScreenCaptureToGCS]: スクリーンショットを保存できました`)
  } catch (error) {
    console.error(`[uploadScreenCaptureToGCS]: ${error}`)
    browser.close();
    process.exit(1);
  }

  try {
    await storage.bucket(bucketName).upload(filePath, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      destination: `capture/screenshot.png`,
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
      },
    });
    console.log('[uploadScreenCaptureToGCS]: storageへのアップロードが完了しました')
  } catch (error) {
    console.log('[uploadScreenCaptureToGCS]: storageへのアップロードでエラーが発生しました')
    console.error(error)
  } finally {
    browser.close();
  }
};

const notifyScreenCaptureToSlack = async (file: any, context:any) => {
  console.log(`Event: ${context.eventId}`);
  console.log(`Event Type: ${context.eventType}`);
  console.log(`Bucket: ${file.bucket}`);
  console.log(`File: ${file.name}`);
  console.log(`Metageneration: ${file.metageneration}`);
  console.log(`Created: ${file.timeCreated}`);
  console.log(`Updated: ${file.updated}`);

  let targetUrl = '';
  try {
    console.log('[notifyScreenCaptureToSlack]: 署名つきURLを取得します');
    const [url] = await storage.bucket(bucketName).file('capture/screenshot.png').getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    targetUrl = url
    console.log('[notifyScreenCaptureToSlack]: 署名つきURLの取得に成功しました');
  } catch (error) {
    console.error(`[notifyScreenCaptureToSlack]: 署名つきURLの取得に失敗しました => ${error}`);
    throw error;
  }

  try {
    console.log('[notifyScreenCaptureToSlack]: slack通知の送信を試みます');
    await webhook.send(targetUrl);
    console.log('[notifyScreenCaptureToSlack]: slack通知に成功しました');
  } catch (error) {
    console.error(`[notifyScreenCaptureToSlack]: slack通知に失敗しました => ${error}`);
    throw error;
  }
};

export {
  uploadScreenCaptureToGCS,
  notifyScreenCaptureToSlack
}
