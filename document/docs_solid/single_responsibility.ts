/*
- Single Responsibility Principle (SRP):
    + là một trong 5 nguyên lý cơ bản của SOLID.
    + Nguyên lý này nói rằng một class nên chỉ có một lý do để thay đổi (change). 
    + Một class nên chỉ chịu trách nhiệm thực hiện một và chỉ một chức năng cụ thể.

- Nếu 1 class có quá nhiều chức năng thì sẽ khó bảo trì, mở rộng và tái sử dụng code.
*/

class Blog {
  title: string;
  content: string;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }

  createBlog() {
    // Code to create a blog
  }
  deleteBlog() {
    // Code to delete a blog
  }
  updateBlog() {
    // Code to update a blog
  }
}

class DisPlayPostScreen {
  blog: Blog;

  constructor(blog: Blog) {
    this.blog = blog;
  }

  displayHTML() {
    return `<h1>${this.blog.title}</h1><p>${this.blog.content}</p>`;
  }
}
