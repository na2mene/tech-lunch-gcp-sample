import { Router, Request, Response } from 'express';
import { PubSub } from '@google-cloud/pubsub';
import { IncomingWebhook } from '@slack/webhook';
import { v4 as uuid } from 'uuid';

const RentalSearchController: Router = Router();
RentalSearchController.post('/capture', async (req: Request, res: Response) => {

  // @see: https://api.slack.com/interactivity/slash-commands#responding_to_commands
  res.status(200).send();

  console.log(`[${req.path}]: が呼ばれました。`);

  const projectId = process.env.PROJECT_ID;
  const topicName = `projects/${projectId}/topics/tech-lunch-capture`;
  const webhook = new IncomingWebhook(process.env.INCOMING_WEB_HOOK || '');
  const pubsub = new PubSub({projectId});

  let message = '処理を受け付けました。';
  try {
    await pubsub.topic(topicName).publish(Buffer.from(JSON.stringify({
      data: {
        requestId: uuid
      }
    })));
    console.log(`[${req.path}]: publishに成功しました`);
  } catch (error) {
    console.error(`[${req.path}]: publishに失敗しました => ${error}`);
    message = `ERRORが発生しました: ${error}`;
  }

  try {
    await webhook.send(message);
    console.log(`[${req.path}]: slackへの通知に成功しました`);
  } catch (error) {
    console.error(`[${req.path}]: slackへの通知に失敗しました => ${error}`);
  }

  res.end();
});

export {
  RentalSearchController,
};
