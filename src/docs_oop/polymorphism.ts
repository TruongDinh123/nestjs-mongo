/*
Tính đa hình (Polymorphism) trong OOP:

- Tính đa hình (Polymorphism) là một khái niệm quan trọng trong lập trình hướng đối tượng (OOP).
- Tính đa hình (Polymorphism) cho phép một đối tượng có thể thể hiện các hành vi khác nhau tùy thuộc vào ngữ cảnh.
- Trong ví dụ trên, chúng ta có 3 class ProductService, ClothingService và ElectronicsService.
- Class ProductService là class cha, ClothingService và ElectronicsService là class con.
- Class con kế thừa các thuộc tính và phương thức của class cha.
- Class con có thể ghi đè (override) phương thức của class cha.
- Trong ví dụ trên, class ClothingService và ElectronicsService ghi đè phương thức createProduct của class cha ProductService.
- Khi gọi phương thức createProduct từ class con, phương thức createProduct của class con sẽ được thực thi.
- Điều này giúp chúng ta tạo ra các phương thức đa hình (polymorphic methods) cho các class con.
- Tính đa hình giúp chúng ta viết code linh hoạt và dễ bảo trì.
- Chúng ta có thể thêm các class con mới mà không cần sửa đổi code của class cha.
- Tính đa hình giúp chúng ta tạo ra các class con với các hành vi khác nhau tùy thuộc vào ngữ cảnh.
- Tính đa hình giúp chúng ta tạo ra các class con với các hành vi riêng biệt mà không cần phải sửa đổi code của class cha.
*/
