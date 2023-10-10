//  Задаем URL API Яндекс Диска и параметры запроса
const api_url = "https://cloud-api.yandex.net/v1/disk/public/resources?";
const public_key =
  "GZmxpG1i/a1RkydCwCAkw6R2WNwY8eVYrSZSz+Q+DEjInbySNS/C7BUFlB39aT1Sq/J6bpmRyOJonT3VoXnDag=="; // Публичный ключ
const token = "y0_AgAAAAAohRJQAAp9JAAAAADs-tQYCWtPZVjCQyuyNzzvMT7WdVM0LxU"; // Ваш токен
const limit = 200000;
// Блок 1: Функция для выполнения запроса к API Яндекс Диска
async function fetchYandexDiskData(path, limit) {
  try {
    const params = new URLSearchParams({
      public_key,
      path,
      limit,
      fields: ["_embedded"],
    });

    const response = await axios.get(`${api_url}${params.toString()}`, {
      headers: {
        Authorization: `OAuth ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Ошибка при выполнении запроса: ${error.message}`);
  }
}
// Блок 2: Инициализация и обработка контейнера с рендерами
const cardsContainer = document.getElementById("images-container");

// Блок 3: Инициализация массивов и опций для фильтрации
let allImagesData = [];
let seriaOptions = [];
let compOptions = [];
let colorOptions = [];
let profileColorOptions = [];
let heightOptions = [];
let widthOptions = [];
let depthOptions = [];

// Блок 4: Функция для заполнения выпадающего списка (select) значениями
function fillSelectOptions(selectId, options) {
  const select = document.getElementById(selectId);
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });
}

// Блок 5: Функция для отображения изображений на странице
function renderImages(images) {
  cardsContainer.innerHTML = ""; // Очищаем контейнер перед отображением

  images.forEach((item) => {
    const card = createCard(item);
    cardsContainer.appendChild(card);
  });
}

// Блок 6: Обработка событий при изменении значений в select
const filterSelects = document.querySelectorAll("select");
filterSelects.forEach((select) => {
  select.addEventListener("change", handleFilters);
});

function updateFilterOptions() {
  const selectedFilters = {
    seria: Array.from(
      document.getElementById("seria-select").selectedOptions
    ).map((option) => option.value.toLowerCase()),
    comp: Array.from(
      document.getElementById("comp-select").selectedOptions
    ).map((option) => option.value.toLowerCase()),
    color: Array.from(
      document.getElementById("color-select").selectedOptions
    ).map((option) => option.value.toLowerCase()),
    profileColor: Array.from(
      document.getElementById("profile-color-select").selectedOptions
    ).map((option) => option.value.toLowerCase()),
    height: Array.from(
      document.getElementById("height-select").selectedOptions
    ).map((option) => option.value.toLowerCase()),
    width: Array.from(
      document.getElementById("width-select").selectedOptions
    ).map((option) => option.value.toLowerCase()),
    depth: Array.from(
      document.getElementById("depth-select").selectedOptions
    ).map((option) => option.value.toLowerCase()),
  };

  // Здесь мы будем хранить информацию о том, какие фильтры были выбраны
  const selectedFiltersMap = {
    seria: false,
    comp: false,
    color: false,
    profileColor: false,
    height: false,
    width: false,
    depth: false,
  };

  // Определяем, какие фильтры были выбраны
  for (const key in selectedFilters) {
    if (selectedFilters[key].length > 0) {
      selectedFiltersMap[key] = true;
    }
  }

  // Обновляем только те фильтры, которые не были выбраны
  for (const select of filterSelects) {
    const id = select.id.replace("-select", "");

    if (!selectedFiltersMap[id]) {
      select.innerHTML = '<option value="">Сбросить</option>';
    }
  }

  // Затем заполняем фильтры значениями на основе выбранных параметров
  const filteredImages = allImagesData.filter((item) => {
    const itemNameParts = item.name.toLowerCase().split("_");

    return (
      (selectedFilters.seria.length === 0 ||
        selectedFilters.seria.includes(itemNameParts[0])) &&
      (selectedFilters.comp.length === 0 ||
        selectedFilters.comp.includes(itemNameParts[1])) &&
      (selectedFilters.color.length === 0 ||
        selectedFilters.color.includes(itemNameParts[2])) &&
      (selectedFilters.profileColor.length === 0 ||
        selectedFilters.profileColor.includes(itemNameParts[3])) &&
      (selectedFilters.height.length === 0 ||
        selectedFilters.height.includes(itemNameParts[4])) &&
      (selectedFilters.width.length === 0 ||
        selectedFilters.width.includes(itemNameParts[5])) &&
      (selectedFilters.depth.length === 0 ||
        selectedFilters.depth.includes(itemNameParts[6]))
    );
  });

  // Далее обновляем опции в фильтрах на основе отфильтрованных данных
  const availableOptions = {
    seria: [],
    comp: [],
    color: [],
    profileColor: [],
    height: [],
    width: [],
    depth: [],
  };

  filteredImages.forEach((item) => {
    const itemNameParts = item.name.toLowerCase().split("_");
    availableOptions.seria.push(itemNameParts[0]);
    availableOptions.comp.push(itemNameParts[1]);
    availableOptions.color.push(itemNameParts[2]);
    availableOptions.profileColor.push(itemNameParts[3]);
    availableOptions.height.push(itemNameParts[4]);
    availableOptions.width.push(itemNameParts[5]);
    availableOptions.depth.push(itemNameParts[6]);
  });

  for (const select of filterSelects) {
    const id = select.id.replace("-select", "");

    if (!selectedFiltersMap[id]) {
      availableOptions[id] = [...new Set(availableOptions[id])]; // Удаляем дубликаты
      fillSelectOptions(select.id, availableOptions[id]);
    }
  }
}

// Блок 7: Функция для фильтрации и отображения изображений

function handleFilters(event) {
  const selectedFilters = {
    seria: Array.from(
      document.getElementById("seria-select").selectedOptions
    ).map((option) => option.value.toLowerCase()),
    comp: Array.from(
      document.getElementById("comp-select").selectedOptions
    ).map((option) => option.value.toLowerCase()),
    color: Array.from(
      document.getElementById("color-select").selectedOptions
    ).map((option) => option.value.toLowerCase()),
    profileColor: Array.from(
      document.getElementById("profile-color-select").selectedOptions
    ).map((option) => option.value.toLowerCase()),
    height: Array.from(
      document.getElementById("height-select").selectedOptions
    ).map((option) => option.value.toLowerCase()),
    width: Array.from(
      document.getElementById("width-select").selectedOptions
    ).map((option) => option.value.toLowerCase()),
    depth: Array.from(
      document.getElementById("depth-select").selectedOptions
    ).map((option) => option.value.toLowerCase()),
  };

  // Обрабатываем событие только для текущего select
  if (event.target.value === "") {
    event.target.selectedIndex = -1; // Сбрасываем выбор в "Все..."

    // Очищаем контейнер перед отображением результатов поиска
    cardsContainer.innerHTML = "";

    // Отображаем изображения, учитывая только фильтры, отличные от текущего select
    const filteredImages = allImagesData.filter((item) => {
      const itemNameParts = item.name.toLowerCase().split("_");
      const selectId = event.target.id.replace("-select", "");

      // Проверяем, соответствует ли изображение выбранным значениям в остальных фильтрах
      return (
        (selectId === "seria" ||
          selectedFilters.seria.length === 0 ||
          selectedFilters.seria.includes(itemNameParts[0])) &&
        (selectId === "comp" ||
          selectedFilters.comp.length === 0 ||
          selectedFilters.comp.includes(itemNameParts[1])) &&
        (selectId === "color" ||
          selectedFilters.color.length === 0 ||
          selectedFilters.color.includes(itemNameParts[2])) &&
        (selectId === "profile-color" ||
          selectedFilters.profileColor.length === 0 ||
          selectedFilters.profileColor.includes(itemNameParts[3])) &&
        (selectId === "height" ||
          selectedFilters.height.length === 0 ||
          selectedFilters.height.includes(itemNameParts[4])) &&
        (selectId === "width" ||
          selectedFilters.width.length === 0 ||
          selectedFilters.width.includes(itemNameParts[5])) &&
        (selectId === "depth" ||
          selectedFilters.depth.length === 0 ||
          selectedFilters.depth.includes(itemNameParts[6]))
      );
    });

    // Отображаем отфильтрованные изображения
    renderImages(filteredImages);

    // Обновляем опции в текущем select
    updateFilterOptions.call(this); // Используем call, чтобы передать текущий элемент select
    return;
  }

  // Очищаем контейнер перед отображением результатов поиска
  cardsContainer.innerHTML = "";

  // Проверяем, есть ли выбранные фильтры
  const noFiltersSelected = Object.values(selectedFilters).every(
    (filter) => filter.length === 0
  );

  if (noFiltersSelected) {
    // Если нет выбранных фильтров, отобразите все изображения
    renderImages(allImagesData);
  } else {
    // Фильтруем изображения, соответствующие выбранным значениям из select
    const filteredImages = allImagesData.filter((item) => {
      const itemNameParts = item.name.toLowerCase().split("_");

      return (
        (selectedFilters.seria.length === 0 ||
          selectedFilters.seria.includes(itemNameParts[0])) &&
        (selectedFilters.comp.length === 0 ||
          selectedFilters.comp.includes(itemNameParts[1])) &&
        (selectedFilters.color.length === 0 ||
          selectedFilters.color.includes(itemNameParts[2])) &&
        (selectedFilters.profileColor.length === 0 ||
          selectedFilters.profileColor.includes(itemNameParts[3])) &&
        (selectedFilters.height.length === 0 ||
          selectedFilters.height.includes(itemNameParts[4])) &&
        (selectedFilters.width.length === 0 ||
          selectedFilters.width.includes(itemNameParts[5])) &&
        (selectedFilters.depth.length === 0 ||
          selectedFilters.depth.includes(itemNameParts[6]))
      );
    });

    // Отображаем отфильтрованные изображения
    renderImages(filteredImages);
  }

  // Обновляем опции в фильтрах
  updateFilterOptions.call(this); // Используем call, чтобы передать текущий элемент select
}
// Блок 8: Функция для создания карточки с изображением и ссылкой
function createCard(item) {
  const card = document.createElement("div");
  card.classList.add("card"); // Добавьте класс карточки по желанию

  const cardDescription = document.createElement("div");
  cardDescription.classList.add("card-description"); // Добавьте класс карточки по желанию
  card.appendChild(cardDescription);

  // Создаем изображение
  const img = document.createElement("img");
  img.src = item.preview;
  img.alt = item.name;
  card.appendChild(img);

  // Извлекаем значения высоты, ширины и глубины из имени файла
  const itemNameParts = item.name.split("_");
  const height = itemNameParts[4];
  const width = itemNameParts[5];
  const depth = itemNameParts[6];

  // Создаем строку с описанием
  const descriptionText = `В: ${height} мм\nШ: ${width} мм\nГ: ${depth} мм`;

  // Создаем элемент с текстом описания
  const description = document.createElement("p");
  description.textContent = descriptionText;
  cardDescription.appendChild(description);

  // Создаем ссылку
  const link = document.createElement("a");
  link.href = item.file; // Замените на URL, который вы хотите использовать

  // Создаем элемент <i> с классом "fa fa-download"
  const downloadIcon = document.createElement("i");
  downloadIcon.classList.add("fa", "fa-download");
  downloadIcon.setAttribute("aria-hidden", "true");

  // Добавляем элемент <i> внутрь ссылки
  link.appendChild(downloadIcon);

  // Добавляем ссылку внутрь элемента cardDescription
  cardDescription.appendChild(link);

  return card;
}

// Блок 9: Функция для получения списка папок с фотографиями
async function fetchPhotoFolders() {
  const path = "/избранное";
  // const offset = 0;

  try {
    const jsonData = await fetchYandexDiskData(path, limit);

    allImagesData = jsonData._embedded.items; // Сохраняем все данные об изображениях
    allImagesData.forEach((item) => {
      const itemNameParts = item.name.split("_");
      if (itemNameParts.length >= 7) {
        // Добавляем значения в массивы только если разбитых частей достаточно
        seriaOptions.push(itemNameParts[0]);
        compOptions.push(itemNameParts[1]);
        colorOptions.push(itemNameParts[2]);
        profileColorOptions.push(itemNameParts[3]);
        heightOptions.push(itemNameParts[4]);
        widthOptions.push(itemNameParts[5]);
        depthOptions.push(itemNameParts[6]);
      }
    });
    // Удалите дубликаты из массивов, если они есть
    seriaOptions = [...new Set(seriaOptions)];
    compOptions = [...new Set(compOptions)];
    colorOptions = [...new Set(colorOptions)];
    profileColorOptions = [...new Set(profileColorOptions)];
    heightOptions = [...new Set(heightOptions)];
    widthOptions = [...new Set(widthOptions)];
    depthOptions = [...new Set(depthOptions)];

    // Заполняем выпадающие списки (select) значениями из массивов
    fillSelectOptions("seria-select", seriaOptions);
    fillSelectOptions("comp-select", compOptions);
    fillSelectOptions("color-select", colorOptions);
    fillSelectOptions("profile-color-select", profileColorOptions);
    fillSelectOptions("height-select", heightOptions);
    fillSelectOptions("width-select", widthOptions);
    fillSelectOptions("depth-select", depthOptions);

    // Отображаем изображения на странице
    renderImages(allImagesData);
  } catch (error) {
    // Обработка ошибок
    console.error("Ошибка при получении списка картинок:", error);
  }
}
const showFilesButton = document.getElementById("showFilesButton");
const fileListModal = document.getElementById("fileListModal");
const closeModalButton = document.getElementById("closeModal");
const fileList = document.getElementById("fileList");
const selectAllCheckbox = document.getElementById("selectAllCheckbox");

// Функция для обновления полосы прогресса и текста
function updateProgress(progress) {
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  progressBar.style.width = progress + "%";
  progressText.textContent = `Загрузка: ${progress}%`;

  if (progress === 100) {
    progressText.textContent = "Загрузка завершена!";
  }
}

// Функция для получения списка файлов и отображения их в модальном окне
async function fetchAndPublishFiles() {
  try {
    const folder = "Загрузки";

    // Получаем список файлов
    const files = await fetchFiles(folder, limit);

    // Сбрасываем полосу прогресса и текст
    updateProgress(0);

    // Отображаем модальное окно
    fileListModal.style.display = "block";

    // Очищаем список файлов перед добавлением новых
    fileList.innerHTML = "";

    // Добавляем чекбокс "Выбрать все"
    const selectAllLabel = document.createElement("label");
    selectAllLabel.textContent = "Выбрать все";
    selectAllLabel.classList.add("selectAllLabel");

    selectAllCheckbox.type = "checkbox";
    selectAllLabel.appendChild(selectAllCheckbox);
    fileList.appendChild(selectAllLabel);

    // Добавляем каждый файл в список
    files.forEach(async (item) => {
      const listItem = document.createElement("li");

      // Создаем элемент изображения для preview
      const previewImage = document.createElement("img");
      previewImage.classList.add("previewImage");
      // previewImage.src = item.file;
      previewImage.alt = item.name;

      // Создаем элемент с именем файла
      const fileName = document.createElement("span");
      fileName.textContent = item.name;

      // Создаем элемент чекбокса
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("fileCheckbox");

      // Добавляем изображение, имя файла и чекбокс в элемент <li>
      listItem.appendChild(checkbox);
      listItem.appendChild(previewImage);
      listItem.appendChild(fileName);
      fileList.appendChild(listItem);
    });

    // Публикуем и перемещаем файлы при нажатии на кнопку
    const publishButton = document.createElement("button");
    publishButton.textContent = "Публиковать и перемещать выбранные файлы";
    publishButton.addEventListener("click", async () => {
      const selectedFiles = getSelectedFiles(files);

      // Обнуляем прогресс перед началом операций
      updateProgress(0);

      try {
        const destinationFolder = "/фото 70419/избранное";
        const totalFiles = selectedFiles.length;
        let completedFiles = 0;

        for (const file of selectedFiles) {
          const fileName = file.name; // Получаем имя файла
          const destinationPath = `${destinationFolder}/${fileName}`; // Формируем новый путь с именем файла

          // Публикуем файл и ждем завершения операции
          await publishFile(file.path);

          // Перемещаем файл с новым путем и ждем завершения операции
          await moveFile(file.path, destinationPath);

          // Увеличиваем количество завершенных операций и обновляем прогресс
          completedFiles++;
          const progress = (completedFiles / totalFiles) * 100;
          updateProgress(progress);
        }

        console.log("Выбранные файлы успешно опубликованы и перемещены.");
      } catch (error) {
        console.error(
          `Ошибка при публикации и перемещении файлов: ${error.message}`
        );
      }
    });

    fileList.appendChild(publishButton);

    // Обработчик для чекбокса "Выбрать все"
    selectAllCheckbox.addEventListener("change", () => {
      const checkboxes = document.querySelectorAll(".fileCheckbox");
      checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAllCheckbox.checked;
      });
    });
  } catch (error) {
    console.error(error);
  }
}

// Функция для получения списка файлов
async function fetchFiles(folder, limit) {
  try {
    const response = await fetch(
      `https://cloud-api.yandex.net/v1/disk/resources?path=${folder}&limit=${limit}`,
      {
        headers: {
          Authorization: `OAuth ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Ошибка при получении списка файлов: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const files = data._embedded.items.filter((item) => item.type === "file");
    return files;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Функция для получения выбранных файлов
function getSelectedFiles(files) {
  const checkboxes = document.querySelectorAll(".fileCheckbox");
  const selectedFiles = [];

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      selectedFiles.push(files[index]);
    }
  });

  return selectedFiles;
}

// Функция для публикации и перемещения файлов
async function publishAndMoveFiles(files) {
  try {
    const destinationFolder = "/фото 70419/избранное"; // Замените на путь к целевой папке

    // Создаем массив промисов для операций публикации и перемещения
    const promises = files.map(async (file, index) => {
      const fileName = file.name; // Получаем имя файла
      const destinationPath = `${destinationFolder}/${fileName}`; // Формируем новый путь с именем файла

      // Публикуем файл и ждем завершения операции
      await publishFile(file.path);

      // Перемещаем файл с новым путем и ждем завершения операции
      await moveFile(file.path, destinationPath);
    });

    // Ждем завершения всех операций
    await Promise.all(promises);

    // Обновляем прогресс после завершения всех операций
    updateProgress(100);

    console.log("Выбранные файлы успешно опубликованы и перемещены.");
  } catch (error) {
    console.error(
      `Ошибка при публикации и перемещении файлов: ${error.message}`
    );
  }
}

// Функция для публикации файла
async function publishFile(filePath) {
  const response = await fetch(
    `https://cloud-api.yandex.net/v1/disk/resources/publish?path=${encodeURIComponent(
      filePath
    )}`,
    {
      method: "PUT",
      headers: {
        Authorization: `OAuth ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Ошибка при публикации файла: ${response.status} ${response.statusText}`
    );
  }

  console.log(`Файл по пути ${filePath} успешно опубликован.`);
}

// Функция для перемещения файла
async function moveFile(filePath, destinationFolder) {
  try {
    const response = await fetch(
      `https://cloud-api.yandex.net/v1/disk/resources/move?from=${encodeURIComponent(
        filePath
      )}&path=${encodeURIComponent(destinationFolder)}`,
      {
        method: "POST",
        headers: {
          Authorization: `OAuth ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Ошибка при перемещении файла: ${response.status} ${response.statusText}`
      );
    }

    console.log(
      `Файл по пути ${filePath} успешно перемещен в папку ${destinationFolder}.`
    );
  } catch (error) {
    console.error(
      `Ошибка при перемещении файла: ${error.message}. Файл: ${filePath}`
    );
  }
}

showFilesButton.addEventListener("click", fetchAndPublishFiles);
closeModalButton.addEventListener("click", () => {
  fileListModal.style.display = "none";
  selectAllCheckbox.checked = false;
});

// Обработчик для кнопки "Скачать Excel"
document.getElementById("downloadExcelButton").addEventListener("click", () => {
  // Вызываем функцию для создания Excel-файла
  createExcelFile();
});

// Функция для создания EXCEL-файла
function createExcelFile() {
  // Создаем новую рабочую книгу Excel
  const workbook = XLSX.utils.book_new();

  // Создаем лист для добавления данных
  const worksheet = XLSX.utils.json_to_sheet(allImagesData);

  // Добавляем лист к рабочей книге
  XLSX.utils.book_append_sheet(workbook, worksheet, "Images");

  // Создаем файл Excel
  XLSX.writeFile(workbook, "images.xlsx");
}

// Блок 13: Обработка события при нажатии на кнопку сброса фильтров
const resetFiltersButton = document.getElementById("resetFiltersButton");

resetFiltersButton.addEventListener("click", () => {
  // Сбрасываем все выбранные значения в фильтрах
  filterSelects.forEach((select) => {
    select.selectedIndex = -1;
  });

  // Очищаем контейнер перед отображением всех изображений
  cardsContainer.innerHTML = "";

  // Отображаем все изображения
  renderImages(allImagesData);

  // Обновляем опции во всех фильтрах
  updateFilterOptions();
});

// Блок 12: Вызов функции для получения списка папок с фотографиями при загрузке страницы
fetchPhotoFolders();
