// Замените 'YOUR_API_KEY' на ваш API-ключ Яндекс Диска
const apiKey = "y0_AgAEA7qj-lkeAADLWwAAAADsgiLgkE6kJHAWTUSZvyjSNt0wdlWr_7U";

// Функция для выполнения GET-запросов к API Яндекс Диска
async function fetchData(url) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `OAuth ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Ошибка при запросе к API: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Произошла ошибка:", error);
    throw error;
  }
}

// Пример запроса к API для получения списка файлов в папке
async function getImagesInFolder(folderPath) {
  const apiUrl = `https://cloud-api.yandex.net/v1/disk/resources?path=${folderPath}`;
  try {
    const data = await fetchData(apiUrl);
    return data;
  } catch (error) {
    // Обработайте ошибку
  }
}

// Пример использования функции
const folderPath = "/root/Фото"; // Замените на путь к папке с изображениями
getImagesInFolder(folderPath).then((response) => {
  // Отфильтруйте только изображения (например, по расширению файла)
  const images = response._embedded.items.filter(
    (item) => item.media_type === "image"
  );
  displayImages(images);
});

function displayImages(images) {
  const imageContainer = document.getElementById("imageContainer");

  // Очистите контейнер перед добавлением новых изображений
  imageContainer.innerHTML = "";

  images.forEach((image) => {
    const imgElement = document.createElement("img");
    imgElement.src = `https://webdav.yandex.ru${image.path}`;

    imgElement.alt = image.name;

    // Вставьте URL изображения в консоль для отладки
    console.log("URL изображения:", image.file);

    // Добавьте изображение в контейнер
    imageContainer.appendChild(imgElement);
  });
}
