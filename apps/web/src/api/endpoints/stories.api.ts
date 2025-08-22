import apiClient from '../client/apiClient';
import type { Page } from '../types/common.types';
import type { StoryListItem, StoryMeta } from '../types/story.types';

const STORIES_BASE_PATH = '/stories';

export const storiesApi = {
  // Get stories list with pagination
  getStories: async (page: number = 1, size: number = 9): Promise<Page<StoryListItem>> => {
    const response = await apiClient.get<Page<StoryListItem>>(STORIES_BASE_PATH, {
      params: { page, size }
    });
    return response.data;
  },

  // Get story detail by ID
  getStoryDetail: async (storyId: number): Promise<StoryMeta> => {
    const response = await apiClient.get<StoryMeta>(`${STORIES_BASE_PATH}/${storyId}`);
    return response.data;
  }
};