// const token = "y0_AgAEA7qj-lkeAAp_nQAAAADstiPuO8SuZWGaT8mJjq71SE-zUwyNzuo"; // Ваш OAuth-токен
// const path = "disk:/"; // Путь к файлу или папке на Диске

// const imageContainer = document.getElementById("image-container");

// axios
//   .get(
//     `https://cloud-api.yandex.net/v1/disk/resources?path=${encodeURIComponent(
//       path
//     )}`,
//     {
//       headers: {
//         Authorization: `OAuth ${token}`,
//       },
//     }
//   )
//   .then((response) => {
//     const files = response.data._embedded.items;

//     files.forEach((file) => {
//       // Проверяем, является ли файл изображением по расширению

//       const imageUrl = file.preview;
//       console.log(files);
//       // Создаем элемент <img> и добавляем его в контейнер
//       const image = document.createElement("img");
//       image.src = imageUrl;
//       image.alt = file.name;
//       imageContainer.appendChild(image);
//     });
//   })
//   .catch((error) => {
//     console.error(error);
//   });
