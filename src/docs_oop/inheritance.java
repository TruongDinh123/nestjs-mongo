/*

Tính kế thừa (Inheritance) trong OOP:

- Tính kế thừa trong OOP:
- Cho phép 1 class con kế thừa các properties (thuộc tính) và methods (phương thức) từ 1 lớp cha (superclass).
- Giúp tái sử dụng mã nguồn và xây dựng hệ thống phức tạp 1 cái dễ dàng.

- Ví dụ, nếu bạn có một lớp cha Vehicle với các thuộc tính và phương thức cơ bản như speed và move(), 
bạn có thể tạo các lớp con như Car và Bicycle kế thừa từ Vehicle và thêm các thuộc tính và phương thức riêng của chúng.

- Trong ví dụ này, Vehicle là lớp cha với thuộc tính speed và phương thức move(). 
Car và Bicycle là các lớp con kế thừa từ Vehicle và thêm các thuộc tính và phương thức riêng của chúng.
*/

// Lớp cha (Superclass)
class Vehicle {
    protected int speed;

    public void move() {
        System.out.println("Vehicle is moving at speed: " + speed);
    }
}

// Lớp con (Subclass)
class Car extends Vehicle {
    private int numberOfDoors;

    public Car(int speed, int numberOfDoors) {
        this.speed = speed;
        this.numberOfDoors = numberOfDoors;
    }

    public void display() {
        System.out.println("Car has " + numberOfDoors + " doors and is moving at speed: " + speed);
    }
}

// Lớp con khác (Subclass)
class Bicycle extends Vehicle {
    private boolean hasBell;

    public Bicycle(int speed, boolean hasBell) {
        this.speed = speed;
        this.hasBell = hasBell;
    }

    public void ringBell() {
        if (hasBell) {
            System.out.println("Bicycle bell rings!");
        } else {
            System.out.println("This bicycle has no bell.");
        }
    }
}
