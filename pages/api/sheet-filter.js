import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

let doc = null;

const getdoc = async () => {
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file']; // 해당 API로 sheets를 손대겠다는 범위 설정입니다.

  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: SCOPES,
  });

  doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
};

const handler = async (req, res) => {
  try {
    const body = req.body;

    if (!doc) {
      await getdoc();
    }

    const sheets = doc.sheetsByTitle[body.sheetName];
    const rows = await sheets.getRows();

    const table = rows.filter((row) => row.get(body.columnId).indexOf(body.word) !== -1);
    let result = {};

    const columns = body.resColumn;
    table.forEach((element) => {
      let tmpArr = {};

      columns.forEach((column) => {
        tmpArr = { ...tmpArr, [column]: element.get(column) };
      });

      result = { ...result, [element.rowNumber]: tmpArr };
    });

    return res.status(200).json({ data: result });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e });
  }
};

export default handler;
