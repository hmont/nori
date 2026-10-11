package moe.henry.nori.api;

import java.time.Instant;
import java.util.List;

public record PostView(Integer id, String name, String content, Instant postedAt, List<ReactionView> reactions) {

    public record ReactionView(String emoji, long count, boolean reacted) {}
}
