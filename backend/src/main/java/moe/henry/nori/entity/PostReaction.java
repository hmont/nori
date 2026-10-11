package moe.henry.nori.entity;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SourceType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "post_reactions")
public class PostReaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "post_id", nullable = false, updatable = false)
    private Integer postId;

    @Column(name = "reactor_id", nullable = false, updatable = false)
    private String reactorId;

    @Column(nullable = false, updatable = false)
    private String emoji;

    @CreationTimestamp(source = SourceType.DB)
    @Column(name = "reacted_at", nullable = false, updatable = false)
    private Instant reactedAt;

    protected PostReaction() {
    }

    public PostReaction(Integer postId, String reactorId, String emoji) {
        this.postId = postId;
        this.reactorId = reactorId;
        this.emoji = emoji;
    }

    public Integer getId() {
        return id;
    }

    public Integer getPostId() {
        return postId;
    }

    public String getReactorId() {
        return reactorId;
    }

    public String getEmoji() {
        return emoji;
    }

    public Instant getReactedAt() {
        return reactedAt;
    }
}
