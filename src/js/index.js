import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css"
import { fetchImg, limitPage, renderImg } from "../js/requests";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix';

// https://pixabay.com/api/

const elements = {
  form: document.querySelector('.search-form'),
  divGallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
  target: document.querySelector('.target')
}

const gallareDiv = elements.divGallery;
// let searchQuery = null;
let queryFetch = '';
let pageFetch = '';

elements.form.addEventListener ('submit', onSubmitForm);

const simpleBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const obsScroll = new IntersectionObserver(onObsScroll, {rootMargin: '300px'});

function onSubmitForm(evt) {
  evt.preventDefault();
  const query = evt.currentTarget.elements.searchQuery.value;
  if (!query.trim() || query === queryFetch) {
    return;
  }
  queryFetch = query;
  obsScroll.observe(elements.target);
  elements.divGallery.innerHTML = '';
  pageFetch = 1;
  firstNumberImg(queryFetch, pageFetch);
  elements.form.reset();
}

const firstNumberImg = async (queryFetch, pageFetch) => {
  try {
      Loading.circle('Loading', {
          svgColor: '#9a25be',
      });
      const data = await fetchImg(queryFetch, pageFetch);
      Loading.remove();
      if (!data.totalHits) {
          Notify.failure(
              "Sorry, there are no images matching your search query. Please try again."
          );
          return;
      }
      renderImg(data);

      simpleBox.refresh();

      if (pageFetch === 1) {
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
          // obsScroll.observe(elements.target);
      }
      if (data.totalHits <= pageFetch * limitPage) {
          Notify.failure(
              "We're sorry, but you've reached the end of search results."
          )
      }

  } catch (error) {
      console.log(error);
      Notify.failure('Oops! Something went wrong!')
  }
};

function onObsScroll(entries) {
  entries.forEach(entry => {
    console.log(entry);
    if (entry.isIntersecting) {
      pageFetch += 1;
      smoothScroll();
      fetchImg(queryFetch, pageFetch)
      .then(data => {
        renderImg(data);
        simpleBox.refresh();
        if (pageFetch > data.totalHits / limitPage) {
            obsScroll.unobserve(elements.target);
        }
      })
    .catch(err => Notify.failure(err.message))
    .finally(() => Loading.remove());
    }
  });
}

function smoothScroll() {
  const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
  window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
  });
}

// async function loadMore() {
//     if (isGalleryLoaded) {
//         currentPage++;
//         showLoader()
//             const images = await searchImages(currentQuery);
//             if (images.length === 0) {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Oops...',
//                     text: "We're sorry, but you've reached the end of search results for images.",
//                 });
//                 observer.unobserve(guard);
//             } else {
//                 // Обработка загруженных изображений
//                 renderImages(images);
//                 scrollToNextGroup();
//             }
//         }
//         hideLoader();
//     }

export { gallareDiv };