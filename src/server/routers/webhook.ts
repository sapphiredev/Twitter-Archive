import crypto from 'crypto';
	
import * as Express from 'express';

import {
	Tweet,
} from '../../shared/models';

import {
	Database,
	Twitter,
} from '../libs';

const router = Express.Router();

router.get('/', (req, res) => {
	const hmac = crypto.createHmac('sha256', __env.consumer_secret);
	hmac.update(req.query.crc_token);

	res.status(200).json({
		'response_token': `sha256=${hmac.digest('base64')}`,
	});
});

router.post('/', (req, res) => {
	const data = req.body;
	if(data.tweet_create_events !== undefined) {
		data.tweet_create_events.forEach((e: Tweet) => {
			Database.addQueue(e);
		});
	}
	res.json(true);
});

router.get('/list', (_, res) => {
	Twitter.getWebhookList().then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	});
});

router.get('/set', (req, res) => {
	Twitter.setWebhook();
	res.json(true);
});

router.get('/subscribe', (_, res) => {
	Twitter.subscribe();
	res.json(true);
});

export default router;