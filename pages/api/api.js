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
