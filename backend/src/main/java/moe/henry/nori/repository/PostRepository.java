package moe.henry.nori.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import moe.henry.nori.entity.Post;

public interface PostRepository extends JpaRepository<Post, Integer> {
    Page<Post> findAllByOrderByPostedAtDesc(Pageable pageable);
}
