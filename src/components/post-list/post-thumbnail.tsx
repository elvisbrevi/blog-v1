import { useState } from 'react';

// Small copy of a cover: /images/covers/name.webp -> /images/covers/thumbs/name.webp
// (see AGENTS.md). Falls back to the full cover if the thumbnail doesn't exist.
function thumbnailFor(cover: string): string {
  return cover.replace(/\/covers\/([^/]+)$/, '/covers/thumbs/$1');
}

interface PostThumbnailProps {
  cover: string;
  eager: boolean;
}

const PostThumbnail = ({ cover, eager }: PostThumbnailProps) => {
  const [src, setSrc] = useState(() => thumbnailFor(cover));

  return (
    <img
      className="post-thumbnail"
      src={src}
      alt=""
      width={176}
      height={100}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setSrc(cover)}
    />
  );
};

export default PostThumbnail;
