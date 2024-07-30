/*
Encapsulation (Đóng gói)

Ví dụ thực tế: Hệ thống quản lý tài khoản ngân hàng
Giả sử bạn đang xây dựng một hệ thống quản lý tài khoản ngân hàng.
Bạn muốn bảo vệ thông tin số dư tài khoản và chỉ cho phép truy cập 
hoặc thay đổi thông qua các phương thức công khai.

Định nghĩa: 

- Encapsulation là kỹ thuật ẩn giấu các chi tiết triển khai 
của một đối tượng và chỉ cho phép truy cập hoặc sửa đổi thông qua các 
phương thức công khai (public methods).

- Thuộc tính private và protected: Các thuộc tính được khai báo là private hoặc
protected chỉ có thể truy cập từ bên trong lớp hoặc các lớp con (đối với protected).

- Phương thức getter và setter: Cung cấp các phương thức công khai để truy cập và 
sửa đổi các thuộc tính private.
*/

class BankAccount {
  private _balance: number;

  constructor(initialBalance: number) {
    this._balance = initialBalance;
  }

  // Getter cho thuộc tính balance
  public getBalance(): number {
    return this._balance;
  }

  // Phương thức để nạp tiền vào tài khoản
  public deposit(amount: number): void {
    if (amount > 0) {
      this._balance += amount;
      console.log(`Deposited: ${amount}. New balance: ${this._balance}`);
    } else {
      console.log('Deposit amount must be positive.');
    }
  }

  // Phương thức để rút tiền từ tài khoản
  public withdraw(amount: number): void {
    if (amount > 0 && amount <= this._balance) {
      this._balance -= amount;
      console.log(`Withdrew: ${amount}. New balance: ${this._balance}`);
    } else {
      console.log('Invalid withdraw amount.');
    }
  }
}

const myAccount = new BankAccount(1000);
console.log(myAccount.getBalance()); // Output: 1000

myAccount.deposit(500); // Output: Deposited: 500. New balance: 1500
myAccount.withdraw(200); // Output: Withdrew: 200. New balance: 1300
myAccount.withdraw(2000); // Output: Invalid withdraw amount.
