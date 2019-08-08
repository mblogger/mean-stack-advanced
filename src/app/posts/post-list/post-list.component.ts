import { PostService } from './../post.service';
import { Post } from './../post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html'
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  private postSub: Subscription;

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postSub = this.postService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onDeletePost(postId: string) {
    this.postService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
