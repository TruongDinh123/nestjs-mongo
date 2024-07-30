/*
    - Nguyên tắc Denpendency Inversion Princuple - DIP :
        + Nhằm giảm thiểu sự phuojc thuộc trực tiếp giữa các module, giảm sự
        phụ thuộc và tăng cường sự linh hoạt và khả năng tái sử dụng code.
        + Nguyên tắc này nói rằng:
            * Các module cấp cao không nên phụ thuộc vào các module cấp thấp.
            Cả 2 nên phụ thuộc vào abstraction.
            * Interface không nên phụ thuộc vào chi tiết, mà ngược lại, chi tiết
            nên phụ thuộc vào abstraction.

*/

// Abstractions
interface IDatabase {
  save(data: string): void;
}

class MySQLDatabase implements IDatabase {
  save(data: string): void {
    // logic to save data to a MySQL database
  }
}

class MongoDBDatabase implements IDatabase {
  save(data: string): void {
    // logic to save data to a MongoDB database
  }
}

class HighLevelModule {
  private database: IDatabase;

  constructor(database: IDatabase) {
    this.database = database;
  }

  execute(data: string): void {
    // high-level logic
    this.database.save(data);
  }
}

// Instantiate the HighLevelModule with a MySQL database.
let mySQLDatabase: IDatabase = new MySQLDatabase();
let highLevelModule1: HighLevelModule = new HighLevelModule(mySQLDatabase);

// Now use the module to execute some high level function.
highLevelModule1.execute('Some Data for MySQL');

// Instantiate the HighLevelModule with a MongoDB database.
// let mongoDBDatabase: IDatabase = new MongoDBDatabase();
// let highLevelModule2: HighLevelModule = new HighLevelModule(mongoDBDatabase);

// Now use the module to execute some high level function.
// highLevelModule2.execute('Some Data for MongoDB');
