import { Post } from 'src/posts/post.schema';

/* 
    - Nguyên tắc Interface Segregation Principle - ISP:
        + Khuyến khích việc phân chia các interface lớn thành các interface nhỏ
        chuyên biệt hơn để client chỉ cần phụ thuộc vào các interface mà nó cần
        thay vì phụ thuộc vào một interface lớn chứa nhiều method không cần thiết.
    - Mục đích của ISP là giảm sự phụ thuộc vào của một class vào các phương thức mà nó không sử dụng
    Điều này giảm thiểu tác động của các thay đổi trong code, làm cho code dễ bảo trì và mở rộng hơn.
*/
interface BlogService {
  createPost(post: Post): void;

  commentOnPost(comment: Comment): void;

  sharePost(post: Post): void;
}

interface PostCreator {
  createPost(post: Post): void;
}

interface CommentCreator {
  commentOnPost(comment: Comment): void;
}

interface PostSharer {
  sharePost(post: Post): void;
}

class Admin implements PostCreator, CommentCreator, PostSharer {
  createPost(post: Post): void {
    // Actual implementation
  }

  commentOnPost(comment: Comment): void {
    // Actual implementation
  }

  sharePost(post: Post): void {
    // Actual implementation
  }
}

class RegularUser implements CommentCreator, PostSharer {
  commentOnPost(comment: Comment): void {
    // Actual implementation
  }

  sharePost(post: Post): void {
    // Actual implementation
  }
}

class ReadOnlyUser {
  // Doesn't implement any of the interfaces because they can't perform any of these actions.
}
