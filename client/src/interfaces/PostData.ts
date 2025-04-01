export interface PostData {
  title: string;
  slug: string;
  publishedAt: string;
  coverImage: {
    url: string;
  };
  content: {
    html: string;
  }
}