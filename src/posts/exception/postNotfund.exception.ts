import { HttpException, HttpStatus } from '@nestjs/common';

class PostNotFoundexception extends HttpException {
  constructor(postId: string) {
    super(`Post ${postId} not found`, HttpStatus.NOT_FOUND);
  }
}

export default PostNotFoundexception;
