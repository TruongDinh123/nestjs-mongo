/*
    - Nguyên tắc nói rằng:
        + Các đối tượng của lớp cha có thể thay thế bằng các đối tượng của lớp con
        mà không làm thay đổi tính đúng đắn của chương trình
*/

class Bird {
  fly(): void {
    console.log('This bird can fly.');
  }
}

class Duck extends Bird {
  quack(): void {
    console.log('Duck can quack.');
  }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error('Penguins cannot fly.');
  }
}

function makeBirdFly(bird: Bird) {
  bird.fly();
}

const duck = new Duck();
const penguin = new Penguin();

makeBirdFly(duck); // Works fine
makeBirdFly(penguin); // Error: Penguins cannot fly

/*
    - Trong ví dụ trên bạn có thể thấy rằng class Penguin vi phạm nguyên tắc LSP vì nó
    đã thay đổi hành vi của method fly() của class cha là Bird
    - Dẫn tới fuction makeBirdFly() gây ra lỗi.
*/

interface FlyingBird {
  fly(): void;
}

class Bird1 {
  // General bird-related methods can be added here
}

class Duck1 extends Bird1 implements FlyingBird {
  fly(): void {
    console.log('This duck can fly.');
  }

  quack(): void {
    console.log('Duck can quack.');
  }
}

class Penguin1 extends Bird {
  // Penguins cannot fly, so do not implement FlyingBird
  swim(): void {
    console.log('Penguin can swim.');
  }
}

function makeBirdFly1(bird: FlyingBird) {
  bird.fly();
}

const duck1 = new Duck1();
// const penguin = new Penguin(); // Penguin is not a FlyingBird

makeBirdFly1(duck1); // Works fine
// makeBirdFly(penguin); // This line is now incorrect and should not be called

/*
    - Để tuân thủ nguyên tắc trên chúng ta cần phải:
        + Tạo 1 interface chung cho hành vi bay: Điề này cho hpesp những loài
        chim có khả năng bay mới cần trienr khai interface này.
        + Sử dụng lớp trừu tượng hoặc interface cho class Bird: Điều này đảm bảo 
        rằng Bird chỉ định nghĩa những phương thức và thuộc tính chung nhất.

*/

//------------------Ví dụ thực tế-------------------------------//
abstract class PaymentProcessor {
  abstract processPayment(amount: number): void;
}

class CreditCardProcessor extends PaymentProcessor {
  processPayment(amount: number): void {
    console.log(`Processing credit card payment of $${amount}`);
    // implementation details for processing credit card payment...
  }
}

class DebitCardProcessor extends PaymentProcessor {
  processPayment(amount: number): void {
    console.log(`Processing debit card payment of $${amount}`);
    // implementation details for processing debit card payment...
  }
}

class PayPalProcessor extends PaymentProcessor {
  processPayment(amount: number): void {
    console.log(`Processing PayPal payment of $${amount}`);
    // implementation details for processing PayPal payment...
  }
}

function executePayment(paymentProcessor: PaymentProcessor, amount: number) {
  paymentProcessor.processPayment(amount);
}

// Now, we can process payments using any of the payment methods:

const creditCardProcessor = new CreditCardProcessor();
executePayment(creditCardProcessor, 100);

const debitCardProcessor = new DebitCardProcessor();
executePayment(debitCardProcessor, 200);

const payPalProcessor = new PayPalProcessor();
executePayment(payPalProcessor, 300);

/*
    - Ở ví dụ trên ta thấy rằng chúng ta đã tạo ra 1 
    abstract class PaymentProcessor.
    - Các class con của PaymentProcessor như CreditCardProcessor, DebitCardProcessor,
    PayPalProcessor đều phải implement method processPayment().
    - Khi chúng ta gọi hàm executePayment() với các class con của PaymentProcessor
    thì chúng ta không cần phải quan tâm đến chi tiết cụ thể của từng class con.
    - Điều này giúp chúng ta dễ dàng thêm mới các class con khác mà không làm thay đổi
    code đã có.
*/
