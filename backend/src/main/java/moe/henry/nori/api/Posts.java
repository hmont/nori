package moe.henry.nori.api;

import java.util.List;

import org.springframework.http.HttpStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import moe.henry.nori.entity.Post;
import moe.henry.nori.repository.PostRepository;
import moe.henry.nori.service.ReactionService;

@RestController
@RequestMapping("/api/posts")
public class Posts {
    @Autowired private PostRepository postRepository;
    @Autowired private ReactionService reactionService;

    @GetMapping("/fetch")
    public FetchPostsResponse fetch(@RequestParam(name = "p", defaultValue = "1") int page,
            @RequestParam(name = "s", defaultValue = "20") int pageSize,
            @RequestParam(name = "r", required = false) String reactorId) {

        var postsPage = postRepository.findAllByOrderByPostedAtDesc(PageRequest.of(Integer.max(0, page - 1), pageSize));
        var reactions = reactionService.summarize(postsPage.getContent().stream().map(Post::getId).toList(), reactorId);
        var posts = postsPage.getContent().stream()
                .map(post -> new PostView(post.getId(), post.getName(), post.getContent(), post.getPostedAt(),
                        reactions.get(post.getId())))
                .toList();
        return new FetchPostsResponse(posts, page, pageSize, postsPage.hasNext());
    }

    @PostMapping("/react")
    public List<PostView.ReactionView> react(@RequestBody ReactBody body) {
        if (body.reactorId() == null || body.reactorId().isBlank() || body.reactorId().length() > 64) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "reactorId must be 1-64 characters");
        }
        if (body.emoji() == null || !ReactionService.ALLOWED_EMOJIS.contains(body.emoji())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "unsupported emoji");
        }
        if (body.postId() == null || !postRepository.existsById(body.postId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "no such post");
        }

        reactionService.toggle(body.postId(), body.reactorId(), body.emoji());
        return reactionService.summarize(List.of(body.postId()), body.reactorId()).get(body.postId());
    }

    @PostMapping("/create")
    public Post create(@RequestBody CreatePostBody body) {
        var post = new Post(body.name(), body.content(), body.email());
        return postRepository.save(post);
    }
}

class FetchPostsResponse {
    public List<PostView> posts;
    public int page;
    public int pageSize;
    public boolean hasMore;

    public FetchPostsResponse(List<PostView> posts, int page, int pageSize, boolean hasMore) {
        this.posts = posts;
        this.page = page;
        this.pageSize = pageSize;
        this.hasMore = hasMore;
    }
}

record CreatePostBody(String name, String content, String email) {}

record ReactBody(Integer postId, String emoji, String reactorId) {}
