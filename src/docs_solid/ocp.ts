/*
- Nguyyên tắc đóng mở của mà nguyên lý OCP (Open-Closed Principle):
    + Mở là mở rộng và đóng là sửa đổi.
    + Nguyên lý này nói rằng một class nên mở rộng để thêm chức năng mới mà không cần sửa đổi code đã có.

*/

interface Customer {
  giveDiscount(): number;
}

class RegularCustomer implements Customer {
  giveDiscount(): number {
    return 10;
  }
}

class PremiumCustomer implements Customer {
  giveDiscount(): number {
    return 20;
  }
}

class Discount {
  giveDiscount(customer: Customer): number {
    return customer.giveDiscount();
  }
}
