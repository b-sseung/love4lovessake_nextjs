import { createClient } from '@supabase/supabase-js';

export const getLocalJson = async (url, title) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        resolve(result[title]);
      });
  });
};

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY);

export const insertGallery = async (data) => {
  const seq = (await selectGallerySeq(data['date'])) + 1;
  data = { ...data, seq: seq };

  for (let i = 0; i < data['file_data'].length; i++) {
    const base64 = data['file_data'][i];
    data['file_data'][i] = base64.slice(base64.indexOf(',') + 1);
  }

  const response = await supabase.from('t_gallery').insert(data);

  return response;
};

export const selectGallerySeq = async (beforeDate) => {
  const afterDate = `${beforeDate.getFullYear()}-${beforeDate.getMonth() + 1}-${beforeDate.getDate()}`;
  const { data, error } = await supabase.from('t_gallery').select('seq').eq('date', afterDate).order('seq', { ascending: false }).limit(1);
  return data[0]['seq'];
};

// import { GoogleSpreadsheet } from 'google-spreadsheet'; // google-spreadsheet를 불러옵니다.
// import { JWT } from 'google-auth-library'; // Google에 JWT 인증을 위해 google-auth-library를 불러옵니다.

// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']; // 해당 API로 sheets를 손대겠다는 범위 설정입니다.
// const documentID = process.env.GOOGLE_SHEET_ID; // Sheet의 고유 문서 ID입니다.
// const jwt = new JWT({
//   key: process.env.GOOGLE_PRIVATE_KEY,
//   email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
//   scopes: SCOPES,
// }); //JWT로 위에서 불러온 key.json 값을 대입해 넣습니다.

// export async function loadGoogleSheet() {
//   try {
//     const doc = new GoogleSpreadsheet(documentID, jwt);
//     await doc.loadInfo();
//     return doc;
//   } catch (error) {
//     console.error('Sheet Load Rows Error:', error);
//     throw new Error('Failed to Load Rows data.');
//   }
// }

// // export async function addRow(data) {
// //   try {
// //     const doc = await loadGoogleSheet(); // 문서 불러오기
// //     const sheet = doc.sheetsByTitle['2024']; // 문서 중 특정 시트(탭)을 특정함
// //     await sheet.setHeaderRow(['date', 'seq', 'type', 'target', 'source', 'source_url', 'source_account', 'file_extension', 'file_data']); // 10번째 라인을 헤더로 설정하고 해더이름을 작성함
// //     const rows = await sheet.getRows(); // 해당 시트의 모든 rows를 불러옴
// //     const rowsLengh = rows.length; // 총 Rows의 개수
// //     const seq = rowsLengh + 1; // 총 Rows에서 1을 더해서 문서 번호를 생성함
// //     data.seq = seq.toString(); // 배열에 생성된 문서 번호를 추가함(문자열로 추가함)
// //     const res = await sheet.addRow(data); // Google Sheets에 추가함
// //   } catch (error) {
// //     console.error('Sheet save Row Error:', error);
// //     throw new Error('Failed to save Row data.');
// //   }
// // }
