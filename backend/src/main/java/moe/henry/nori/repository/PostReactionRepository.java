package moe.henry.nori.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import moe.henry.nori.entity.PostReaction;

public interface PostReactionRepository extends JpaRepository<PostReaction, Integer> {
    @Query("""
            select new moe.henry.nori.repository.ReactionCount(r.postId, r.emoji, count(r))
            from PostReaction r
            where r.postId in :postIds
            group by r.postId, r.emoji
            """)
    List<ReactionCount> countByPostIds(Collection<Integer> postIds);

    List<PostReaction> findByPostIdInAndReactorId(Collection<Integer> postIds, String reactorId);

    @Transactional
    long deleteByPostIdAndReactorIdAndEmoji(Integer postId, String reactorId, String emoji);
}
