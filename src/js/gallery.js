export default function galleryCreate(images){
  return images.map(image => {
      const {largeImageURL, webformatURL, tags, likes, views, comments, downloads} = image;
      return `<div class="card">
    <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
        <p class="info-item"><b>Likes</b>${likes}</p>
        <p class="info-item"><b>Views</b>${views}</p>
        <p class="info-item"><b>Comments</b>${comments}</p>
        <p class="info-item"><b>Downloads</b>${downloads}</p>
    </div>
</div>
`
  }).join('');


}