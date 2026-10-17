import { useState } from 'react';

// Small copy of a cover: /images/covers/name.webp -> /images/covers/thumbs/name.webp
// (see AGENTS.md). Falls back to the full cover if the thumbnail doesn't exist.
function thumbnailFor(cover: string): string {
  return cover.replace(/\/covers\/([^/]+)$/, '/covers/thumbs/$1');
}

interface PostThumbnailProps {
  cover: string;
  eager: boolean;
  // The wide card at the top of the list shows the full cover.
  featured: boolean;
}

const PostThumbnail = ({ cover, eager, featured }: PostThumbnailProps) => {
  const [missingThumbnail, setMissingThumbnail] = useState(false);
  const useThumbnail = !featured && !missingThumbnail;

  return (
    <img
      className="post-card-cover"
      src={useThumbnail ? thumbnailFor(cover) : cover}
      srcSet={useThumbnail ? `${thumbnailFor(cover)} 352w, ${cover} 800w` : undefined}
      sizes={useThumbnail ? '(max-width: 640px) 92vw, (max-width: 1100px) 45vw, 352px' : undefined}
      alt=""
      width={800}
      height={457}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={useThumbnail ? () => setMissingThumbnail(true) : undefined}
    />
  );
};

export default PostThumbnail;
