import './sass/main.scss';
import './css/style.css';
import galleryCreate from './js/gallery';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ImgsApiService } from './js/api-service';
import { allRefs } from './js/all-refs';

import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

const apiService = new ImgsApiService();
const refs = allRefs();
const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });

refs.searchForm.addEventListener('submit', onSubmitFofm);
refs.loadMoreBtn.addEventListener('click', onClickLoadMore);

loadMoreBtnHidden();

async function onSubmitFofm(evt) {
  evt.preventDefault();
  const currentRequest = evt.currentTarget.elements.searchQuery.value.trim();

  loadMoreBtnHidden();
  resetGallery();
  apiService.resetPage();
  apiService.seachImg(currentRequest);
  lightbox.refresh();

  try {
    const data = await apiService.fetchImgs();
    console.log(data.data.hits)

    if (data.data.total === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    renderGallery(data.data.hits);
    loadMoreBtnVisible();
    checkGalleryEndPoint(data.data);

    if (apiService.totalImgs >= data.totalHits) {
      loadMoreBtnHidden();
      return Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function onClickLoadMore() {
  loadMoreBtnHidden();
  lightbox.refresh();

  try {
    const data = await apiService.fetchImgs();
    renderGallery(data.data.hits);
    checkGalleryEndPoint(data);
  } catch (error) {
    console.log(error.message);
  }
  loadMoreBtnVisible();
}

function renderGallery(images) {
  refs.gallery.insertAdjacentHTML('beforeend', galleryCreate(images));
}

function resetGallery() {
  refs.gallery.innerHTML = '';
}

function loadMoreBtnHidden() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function loadMoreBtnVisible() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function checkGalleryEndPoint(data) {
  if (apiService.totalImgs >= data.totalHits) {
    loadMoreBtnHidden();
    return Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
