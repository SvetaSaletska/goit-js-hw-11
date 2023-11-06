import { gallareDiv } from './index';
import axios from 'axios';
const API_KEY = '40497331-15e7dc2c1913622b1b802523e'

const limitPage = 40;

axios.defaults.baseURL = 'https://pixabay.com/api/';

const fetchImg = async (queryFetch, pageFetch) => {
  const { data } = await axios ({
    params: {
      key: API_KEY,
      q: queryFetch,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: limitPage,
      page: pageFetch,
    }
  })
  return data;
}

function renderImg(data) {
  const markup = data.hits
  .map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<a class="photo-link" href="${largeImageURL}">
                <div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
                <div class="info">
                <p class="info-item"><b>Likes</b>${likes}</p>
                <p class="info-item"><b>Views</b>${views}</p>
                <p class="info-item"><b>Comments</b>${comments}</p>
                <p class="info-item"><b>Downloads</b>${downloads}</p>
                </div>
                </div>
                </a>`
            }
        )
  .join('');
  gallareDiv.insertAdjacentHTML('beforeend', markup);
}



export { fetchImg, limitPage, renderImg };