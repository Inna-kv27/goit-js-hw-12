import axios from 'axios';

const API_KEY = '48880683-c6af76fdc924f93949198cfc6';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page, perPage) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}
