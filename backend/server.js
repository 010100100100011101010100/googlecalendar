const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = 'http://localhost:3000/callback';

const oauth2Client = new google.auth.OAuth2(
  clientID,
  clientSecret,
  redirectURI
);

const app = express();
app.use(express.json());
const port = 3000;

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(session({
  secret: 'random_secret',
  resave: true,
  saveUninitialized: true,
  cookie: { sameSite: 'lax', secure: false }
}));

app.get('/auth', (req, res) => {
  const authURL = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ['https://www.googleapis.com/auth/calendar.events']
  });
  res.json({ url: authURL });
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  req.session.tokens = tokens;
  res.redirect('http://localhost:3001/event-form');
});

app.post('/create-event', async (req, res) => {
  if (!req.session.tokens) return res.status(401).send("Unauthorised");
  oauth2Client.setCredentials(req.session.tokens);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const { description, startTime, recurrence } = req.body;

  const endTime = new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString();
    await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary:description,
        start: {
          dateTime: startTime,
          timeZone: 'Asia/Kolkata'
        },
        end: {
          dateTime: endTime,
          timeZone: 'Asia/Kolkata'
        },
        recurrence: recurrence || [],
      }
    });
    res.status(200).json({ message: "Event created" });
   
});

app.listen(port, () => console.log(`Server running on port ${port}`));
