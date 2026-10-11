package moe.henry.nori.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import moe.henry.nori.entity.Post;
import moe.henry.nori.repository.PostRepository;

@RestController
@RequestMapping("/api/posts")
public class Posts {
    @Autowired private PostRepository postRepository;

    @GetMapping("/fetch")
    public FetchPostsResponse fetch(@RequestParam(name = "p", defaultValue = "1") int page,
            @RequestParam(name = "s", defaultValue = "20") int pageSize) {

        var postsPage = postRepository.findAllByOrderByPostedAtDesc(PageRequest.of(Integer.max(0, page - 1), pageSize));
        return new FetchPostsResponse(postsPage.getContent(), page, pageSize, postsPage.hasNext());
    }

    @PostMapping("/create")
    public Post create(@RequestBody CreatePostBody body) {
        var post = new Post(body.name(), body.content(), body.email());
        return postRepository.save(post);
    }
}

class FetchPostsResponse {
    public List<Post> posts;
    public int page;
    public int pageSize;
    public boolean hasMore;

    public FetchPostsResponse(List<Post> posts, int page, int pageSize, boolean hasMore) {
        this.posts = posts;
        this.page = page;
        this.pageSize = pageSize;
        this.hasMore = hasMore;
    }
}

record CreatePostBody(String name, String content, String email) {
}