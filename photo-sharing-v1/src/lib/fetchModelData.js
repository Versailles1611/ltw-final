/**
 * fetchModelData.js - Gọi API từ Backend Server với credentials
 */

const BASE_URL = 'http://localhost:3001';

/**
 * Hàm fetchModel - Gọi API và trả về Promise
 * Sử dụng credentials: 'include' để gửi session cookie
 */
function fetchModel(url) {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}${url}`, {
      credentials: 'include', // Gửi cookies cho session
    })
      .then((response) => {
        if (!response.ok) {
          // Không redirect nữa - để component tự xử lý lỗi
          reject(new Error(`HTTP error! Status: ${response.status}`));
          return;
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error(`Error fetching ${url}:`, error.message);
        reject(error);
      });
  });
}

export default fetchModel;
