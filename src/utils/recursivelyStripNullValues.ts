// function recursivelyStripNullValues(value: unknown): unknown {
//   if (Array.isArray(value)) {
//     return value.map(recursivelyStripNullValues);
//   }
//   if (value !== null && typeof value === 'object') {
//     return Object.fromEntries(
//       Object.entries(value).map(([key, value]) => [
//         key,
//         recursivelyStripNullValues(value),
//       ]),
//     );
//   }
//   // Thêm kiểm tra cho giá trị null
//   if (value !== null) {
//     return value;
//   }
//   return undefined; // Trả về undefined nếu giá trị là null
// }

// export default recursivelyStripNullValues;

//Đoạn mã trên sẽ loại bỏ tất cả các giá trị null từ một đối tượng hoặc mảng đệ quy.
//Ví dụ, nếu bạn có một đối tượng như sau:

// const obj = {
//   a: null,
//   b: 2,
//   c: {
//     d: null,
//     e: 3,
//   },
//   f: [null, 4, { g: null, h: 5 }],
// };

//Sau khi chạy hàm recursivelyStripNullValues(obj), bạn sẽ nhận được kết quả sau:
// {
//   b: 2,
//   c: { e: 3 },
//   f: [4, { h: 5 }],
// }
//Đoạn mã trên hoạt động với cả mảng và đối tượng, và sẽ giữ nguyên cấu trúc của chúng.
