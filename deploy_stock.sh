#!/bin/bash
# NAS blog_posts → Astro git push
# 사용법: ./deploy_stock.sh [slug]  (slug 없으면 미배포 전체 처리)

set -e

NAS_DIR="/Volumes/home/stock-report/blog_posts"
ASTRO_POSTS="/Users/jaeyoonchang/my-blog/src/content/posts"
ASTRO_IMGS="/Users/jaeyoonchang/my-blog/public/images"
BLOG_DIR="/Users/jaeyoonchang/my-blog"
DEPLOYED_LOG="$BLOG_DIR/.deployed_slugs"

touch "$DEPLOYED_LOG"

if [ ! -d "$NAS_DIR" ]; then
  echo "❌ NAS 마운트 안 됨: $NAS_DIR"
  exit 1
fi

TARGET="${1:-}"
deployed_count=0

for post_dir in "$NAS_DIR"/*/; do
  slug=$(basename "$post_dir")
  post_md="$post_dir/post.md"

  # slug 인자가 있으면 해당만 처리
  [ -n "$TARGET" ] && [ "$slug" != "$TARGET" ] && continue

  # post.md 없으면 스킵
  [ ! -f "$post_md" ] && continue

  # 이미 배포됐으면 스킵 (재배포 강제하려면 slug 인자 사용)
  if [ -z "$TARGET" ] && grep -qx "$slug" "$DEPLOYED_LOG"; then
    continue
  fi

  echo "▶ 배포: $slug"

  # 이미지 복사
  img_dst="$ASTRO_IMGS/$slug"
  mkdir -p "$img_dst"
  for img in "$post_dir"*.png "$post_dir"*.jpg; do
    [ -f "$img" ] && cp "$img" "$img_dst/"
  done

  # post.md → posts/{slug}.md 복사 (이미지 경로는 이미 /images/{slug}/ 형태)
  cp "$post_md" "$ASTRO_POSTS/${slug}.md"

  echo "  이미지: $(ls "$img_dst" 2>/dev/null | wc -l | tr -d ' ')개  →  $img_dst"
  echo "  포스트: $ASTRO_POSTS/${slug}.md"

  echo "$slug" >> "$DEPLOYED_LOG"
  deployed_count=$((deployed_count + 1))
done

if [ "$deployed_count" -eq 0 ]; then
  echo "새로 배포할 포스트 없음"
  exit 0
fi

# git push
cd "$BLOG_DIR"
git add src/content/posts/ public/images/
git commit -m "stock: auto-generated post(s) — $(date '+%Y-%m-%d')"
git push origin main
echo "✅ git push 완료 ($deployed_count개)"
