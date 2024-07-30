/*
Abstract (Trừu tượng)

Ví dụ thực tế: Hệ thống quản lý phương tiện giao thông
Giả sử bạn đang xây dựng một hệ thống quản lý phương tiện giao thông. 
Bạn có các loại phương tiện khác nhau như ô tô, xe máy, và xe đạp.
Mỗi loại phương tiện có cách di chuyển riêng, nhưng tất cả đều có một số 
thuộc tính và phương thức chung như move.

- Tóm lại địng nghĩa của abstract là:
- 
- **Định nghĩa**: `abstract` được sử dụng để định nghĩa các lớp và phương thức 
trừu tượng. Một lớp trừu tượng không thể được khởi tạo trực tiếp và thường được 
sử dụng làm lớp cơ sở cho các lớp con.
*/

abstract class Vehicle {
  constructor(public name: string) {}

  // Phương thức trừu tượng
  abstract move(): void;
}

class Car extends Vehicle {
  move(): void {
    console.log(`${this.name} is driving on the road.`);
  }
}

class Bicycle extends Vehicle {
  move(): void {
    console.log(`${this.name} is pedaling on the road.`);
  }
}

const myCar = new Car('Toyota');
myCar.move(); // Output: Toyota is driving on the road.

const myBicycle = new Bicycle('Giant');
myBicycle.move(); // Output: Giant is pedaling on the road.
