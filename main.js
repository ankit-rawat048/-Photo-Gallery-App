// Unsplash API Details
const UNSPLASH_API_KEY = 'S73IoTTowTZaD2-FBcOP5Cc8JQDKncksHSDi2Tj4QKE'; // Replace with your Unsplash API Key

async function fetchFromUnsplash(query) {
  const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_API_KEY}&per_page=15`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Unsplash API Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results.map(img => ({
      imageUrl: img.urls.small,
      alt: img.alt_description || 'No description',
      source: 'Unsplash',
      photographer: img.user.name,
    }));
  } catch (error) {
    console.error('Error fetching from Unsplash:', error);
    return [];
  }
}

// Pexels API Details
const PEXELS_API_KEY = 'FMLsxS9WIzG3rBd9INol7npqSmrO8oLhyvx6e7BWFTcZb7WniJ20Ehti';

async function fetchFromPexels(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });
    if (!response.ok) {
      throw new Error(`Pexels API Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.photos.map(photo => ({
      imageUrl: photo.src.medium,
      alt: photo.alt || 'No description',
      source: 'Pexels',
      photographer: photo.photographer,
    }));
  } catch (error) {
    console.error('Error fetching from Pexels:', error);
    return [];
  }
}

// Fetch Images from Both APIs
async function fetchImages(query) {
  try {
    const [unsplashResults, pexelsResults] = await Promise.all([
      fetchFromUnsplash(query),
      fetchFromPexels(query),
    ]);

    return [...unsplashResults, ...pexelsResults];
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

// Render Images in the Gallery
function renderGallery(images) {
  const gallery = document.getElementById('gallery');
  if (images.length === 0) {
    gallery.innerHTML = '<p>No images found. Try a different search term.</p>';
    return;
  }

  gallery.innerHTML = images
    .map(
      img => `
      <div class="image-card">
        <img src="${img.imageUrl}" alt="${img.alt}" />
      </div>`
    )
    .join('');
}

// Event Listener for Search Button
document.getElementById('searchButton').addEventListener('click', async () => {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '<p>Loading...</p>';

  const images = await fetchImages(query);
  renderGallery(images);
});

