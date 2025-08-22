// Story List Item type (for list view)
export interface StoryListItem {
  story_id: number;
  title: string;
  summary: string;
  created_at: string;
  updated_at: string;
  representative_image?: string;
  author_name?: string;
  author_profile?: string;
  view_count: number;
  like_count: number;
}

// Story Meta type (for detail view)
export interface StoryMeta {
  story_id: number;
  title: string;
  content: string;
  summary?: string;
  created_at: string;
  updated_at: string;
  author: {
    user_id: number;
    name: string;
    profile_image?: string;
  };
  images: string[];
  tags: string[];
  view_count: number;
  like_count: number;
  product?: {
    product_id: number;
    name: string;
    popup_store_name: string;
    representative_image?: string;
    current_price?: number;
  };
}