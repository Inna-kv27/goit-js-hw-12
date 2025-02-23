import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { fetchImages } from './js/pixabay-api.js';
import {
  renderImages,
  clearGallery,
  getCardHeight,
} from './js/render-functions.js';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.createElement('button');
loadMoreButton.textContent = 'Load more';
loadMoreButton.classList.add('load-more');
gallery.after(loadMoreButton);
const loader = document.getElementById('loader');
const loadingText = document.getElementById('loading-text');
const endMessage = document.createElement('p');
endMessage.textContent =
  "We're sorry, but you've reached the end of search results.";
endMessage.style.display = 'none';
gallery.after(endMessage);

let searchQuery = '';
let page = 1;
const perPage = 40;
let totalHits = 0;

loadMoreButton.style.display = 'none';

form.addEventListener('submit', handleSubmit);
loadMoreButton.addEventListener('click', handleLoadMore);

async function handleSubmit(event) {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim();
  page = 1;
  totalHits = 0;
  endMessage.style.display = 'none';

  if (!searchQuery) {
    iziToast.error({ title: 'Error', message: 'Please enter a search query.' });
    return;
  }

  gallery.innerHTML = '';
  loadMoreButton.style.display = 'none';
  loader.style.display = 'block';
  loadingText.style.display = 'block';

  try {
    const data = await fetchImages(searchQuery, page, perPage);
    totalHits = data.totalHits;
    if (data.hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    } else {
      renderImages(data.hits);
      if (data.hits.length === perPage && totalHits > perPage) {
        loadMoreButton.style.display = 'block';
      }
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
    });
  } finally {
    loader.style.display = 'none';
    loadingText.style.display = 'none';
    event.target.reset();
  }
}

async function handleLoadMore() {
  page++;
  loadMoreButton.style.display = 'none';
  loader.style.display = 'block';
  loadingText.style.display = 'block';

  try {
    const data = await fetchImages(searchQuery, page, perPage);
    if (
      data.hits.length === 0 ||
      (page - 1) * perPage + data.hits.length === totalHits
    ) {
      loadMoreButton.style.display = 'none';
      endMessage.style.display = 'block';
    } else {
      renderImages(data.hits);
      loadMoreButton.style.display = 'block';
    }
    const cardHeight = getCardHeight();
    window.scrollBy({
      top: cardHeight * 2,
      left: 0,
      behavior: 'smooth',
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
    });
  } finally {
    loader.style.display = 'none';
    loadingText.style.display = 'none';
  }
}
