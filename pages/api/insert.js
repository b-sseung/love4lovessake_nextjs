import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file']; // 해당 API로 sheets를 손대겠다는 범위 설정입니다.

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: SCOPES,
});

const sheets = google.sheets({
  auth,
  version: 'v4',
});

const handler = async (req, res) => {
  const body = req.body;

  try {
    const uploadYear = body.date.slice(0, 4);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${uploadYear}!A1:I1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[body.date, body.seq, body.type, body.target, body.source, body.source_url, body.source_account, body.file_extension, body.file_data]],
      },
    });
    return res.status(200).json({ data: response.data });
  } catch (e) {
    return res.status(500).send({ message: 'faild' });
  }
};

export default handler;
