const clientId = "b5fea292ec97459ba91e26e84b146f83";
const filter = "jpg"; // Фильтр по расширению файлов (например, jpg)
const imagesContainer = document.getElementById("images");

function getImages() {
  fetch(`https://cloud-api.yandex.net/v1/disk/resources?`, {
    headers: {
      Authorization: `OAuth ${clientId}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const images = data._embedded.items.filter((item) =>
        item.path.endsWith(`.${filter}`)
      );
      imagesContainer.innerHTML = "";
      images.forEach((image) => {
        const imageUrl = image.preview;
        const imageElement = document.createElement("img");
        imageElement.src = imageUrl;
        imagesContainer.appendChild(imageElement);
      });
    })
    .catch((error) => {
      console.error("Ошибка получения изображений:", error);
    });
}

getImages();
