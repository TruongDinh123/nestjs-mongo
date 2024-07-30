npx protoc --plugin=protoc-gen-ts_proto=".\\node_modules\\.bin\\protoc-gen-ts_proto.cmd"
--ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/auth.proto

nest generated apps auth

In general, the request lifecycle looks like the following:

1.Incoming request

2.Middleware
2.1. Globally bound middleware
2.2. Module bound middleware

3.Guards
3.1 Global guards
3.2 Controller guards
3.3 Route guards

4.Interceptors (pre-controller)
4.1 Global interceptors
4.2 Controller interceptors
4.3 Route interceptors

5.Pipes
5.1 Global pipes
5.2 Controller pipes
5.3 Route pipes
5.4 Route parameter pipes

6.Controller (method handler)

7.Service (if exists)

8.Interceptors (post-request)
8.1 Route interceptor
8.2 Controller interceptor
8.3 Global interceptor

9.Exception filters
9.1 route
9.2 controller
9.3 global

10.Server response

1. @Controller() decorator:

   - NestJS sử dụng rất nhiều decorators(Trình trang trí).
   - Để đánh dấu 1 class là 1 controller.
   - @Controller() decorator: Chúng ta sẽ truyền 1 optional argument cho nó.
   - Ví dụ: @Controller('posts')
   - Và nó hoạt động như 1 path prefix sẽ dẫn tới các routes trong controller đấy.

2. Data Transfer Object (DTO): DTO sẽ xác định kiểu dữ liệu được gửi trong 1 request.

   - DTO có thể là 1 interface hoặc 1 class

3. Ưu điểm của NestJS so với Express:

   - NestJS cung cấp rất nhiều thứ vượt trội hơn trong việc thiết kế API và sử dụng các controller.
   - Ngược lại Express.js sẽ giúp chúng ta linh hoạt hơn không việc thiết kế API nhưng sẽ không trạng bị cho chúng ta những
     công cụ như NestJS để tăng khả năng readability of our code.
   - Ưu điểm khác của NestJS là cung cấp các provides để xử lí các đối tượng Request và Response 1 cách linh hoạt như là:
     @Body() và @Params() sẽ giúp bạn improve trong việc readability of our code.

4. @Injectable() decorator sẽ cho NestJs biết rằng 1 class là 1 provider. và chúng ta có thể thêm nó vào module.

5. Module:

   - Chúng ta sử dụng modules để tổ chức các ứng dụng của mình.
   - Ví dụ PostControler và PostService chúng có closely related. Vì vậy chúng nên đặt trong cùng 1 module.

6. Entity:

    - Entity là 1 class sẽ máp tới database table bằng cách sử dụng @Entoty() decorator

7 Repository:

    - Dùng để quản lí cụ thể các entity.
    - Repository nó có thể multiple các funtions và tương tác với entities bằng cách sử dụng lại TypeOrmModule

8 Execution Context:

    - ArgumentsHost` cung cấp phương thức để truy xuất các đối số được truyền đến handler
    và cho phép chọn bối cảnh phù hợp (HTTP, RPC, hoặc WebSockets) để lấy các đối số.

    - ExecutionContext mở rộng từ ArgumentsHost, cung cấp thêm chi tiết về quá trình thực thi hiện tại, bao gồm kiểu của
    controller và handler sắp được gọi

    - Các phương thức như `switchToHttp()`, `switchToRpc()`, và `switchToWs()` giúp chuyển đổi sang bối cảnh phù hợp
    từ đó có thể truy xuất các đối tượng cụ thể như request, response trong HTTP, hoặc client và data trong WebSockets.
