import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

type Data = {
  name: string,
  email: string,
  message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    let data = req.body as Data;

    if(!data) return res.status(500).json({ result: 'Nice try' });

    if(data.message.length < 1) return res.status(500).json({ result: 'MESSAGE_EMPTY' });
    if(data.name.length < 1) return res.status(500).json({ result: 'NAME_EMPTY' });
    if(data.email.length < 1) return res.status(500).json({ result: 'EMAIL_EMPTY' });

    if(data.message.length > 1000) return res.status(500).json({ result: 'MESSAGE_TOO_LONG' });
    if(data.name.length > 30) return res.status(500).json({ result: 'NAME_TOO_LONG' });
    if(data.email.length > 30) return res.status(500).json({ result: 'EMAIL_TOO_LONG' });
    axios.post(process.env.WEBHOOK_URL as string, {
        "embeds": [{
            "color": 3108090,
            "title": req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? 'unknown!?',
            "author": {
                "name": data.name
            },
            "fields": [
              {
                "name": "Email",
                "value": data.email,
                "inline": true
              },
              {
                "name": "Message",
                "value": data.message,
                "inline": true
              }
            ],
        }]
    }).then(response => {
        if(response.data.err) return res.status(500).json({ result: 'DISCORD_API_ERROR' })
        return res.status(200).json({ result: 'Success' })
    })
}
