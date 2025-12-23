/**
 * fetchModelData.js - Gọi API từ Backend Server với credentials
 * Hỗ trợ cả localhost và CodeSandbox
 */

// Auto-detect API URL based on environment
// const getBaseUrl = () => {
//   // Nếu chạy trên CodeSandbox, sử dụng relative URL (same origin)
//   // hoặc có thể dùng window.location để build URL
//   if (typeof window !== "undefined") {
//     const hostname = window.location.hostname;
//     // Nếu đang ở CodeSandbox
//     if (hostname.includes("csb.app") || hostname.includes("codesandbox")) {
//       // Backend chạy trên cùng origin với port 8080
//       // CodeSandbox sẽ proxy requests
//       return ""; // Use relative URL, let proxy handle it
//     }
//   }
//   // Nếu chạy local
//   return "https://w2dy33-8080.csb.app";
// };

const BASE_URL = "https://w2dy33-8080.csb.app";

/**
 * Hàm fetchModel - Gọi API và trả về Promise
 * Sử dụng credentials: 'include' để gửi session cookie
 */
function fetchModel(url) {
  const apiUrl = BASE_URL ? `${BASE_URL}${url}` : url;

  return new Promise((resolve, reject) => {
    fetch(apiUrl, {
      credentials: "include", // Gửi cookies cho session
    })
      .then((response) => {
        if (!response.ok) {
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
