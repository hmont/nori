package moe.henry.nori.service;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import moe.henry.nori.api.PostView.ReactionView;
import moe.henry.nori.entity.PostReaction;
import moe.henry.nori.repository.PostReactionRepository;

@Service
public class ReactionService {
    public static final List<String> ALLOWED_EMOJIS = List.of("❤️", "👍", "😂", "😮", "😢", "🎉");

    @Autowired private PostReactionRepository reactionRepository;

    public Map<Integer, List<ReactionView>> summarize(Collection<Integer> postIds, String reactorId) {
        if (postIds.isEmpty()) {
            return Map.of();
        }

        var counts = reactionRepository.countByPostIds(postIds).stream()
                .collect(Collectors.groupingBy(c -> c.postId()));
        Set<String> mine = new HashSet<>();
        if (reactorId != null && !reactorId.isBlank()) {
            for (var reaction : reactionRepository.findByPostIdInAndReactorId(postIds, reactorId)) {
                mine.add(reaction.getPostId() + ":" + reaction.getEmoji());
            }
        }

        return postIds.stream().collect(Collectors.toMap(id -> id, id -> counts.getOrDefault(id, List.of()).stream()
                .sorted((a, b) -> Integer.compare(ALLOWED_EMOJIS.indexOf(a.emoji()), ALLOWED_EMOJIS.indexOf(b.emoji())))
                .map(c -> new ReactionView(c.emoji(), c.count(), mine.contains(id + ":" + c.emoji())))
                .toList()));
    }

    public void toggle(Integer postId, String reactorId, String emoji) {
        if (reactionRepository.deleteByPostIdAndReactorIdAndEmoji(postId, reactorId, emoji) > 0) {
            return;
        }
        try {
            reactionRepository.save(new PostReaction(postId, reactorId, emoji));
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
        }
    }
}
