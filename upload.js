// Ваш токен
const token = "y0_AgAAAAAohRJQAAp9JAAAAADs-tQYCWtPZVjCQyuyNzzvMT7WdVM0LxU";

// URL для загрузки файла на Яндекс Диск
const api_url_upload = "https://cloud-api.yandex.net/v1/disk/resources/upload";

async function getUploadUrl(destinationFolder, fileNameWithExtension) {
  try {
    const uploadUrl = `${api_url_upload}?path=${encodeURIComponent(
      destinationFolder
    )}/${encodeURIComponent(fileNameWithExtension)}`;
    const response = await axios.get(uploadUrl, {
      headers: {
        Authorization: `OAuth ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data.href;
    } else {
      throw new Error(
        `Ошибка при получении URL для загрузки файла: ${response.statusText}`
      );
    }
  } catch (error) {
    throw new Error(
      `Ошибка при получении URL для загрузки файла на Яндекс Диск: ${error.message}`
    );
  }
}

async function uploadFile(file, uploadUrl) {
  try {
    const response = await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    if (response.status === 201) {
      return true;
    } else {
      throw new Error(`Ошибка при загрузке файла: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(
      `Ошибка при загрузке файла на Яндекс Диск: ${error.message}`
    );
  }
}
const excelFileInput = document.getElementById("excelFileInput");
const fileListUpload = document.getElementById("fileListUpload");

excelFileInput.addEventListener("change", handleFileSelect);

function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0]; // Предполагаем, что данные находятся в первом листе
    const sheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(sheet["!ref"]);

    // Очищаем предыдущие элементы в списке
    fileListUpload.innerHTML = "";

    for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
      const cellAddress = { c: 0, r: rowNum };
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      const cellValue = sheet[cellRef].w;

      const listItemUpload = document.createElement("li");
      listItemUpload.textContent = cellValue + ".jpg" + ": ";
      listItemUpload.setAttribute("data-loaded", "false"); // Помечаем элемент как не загруженный

      const fileInput = document.createElement("input");
      fileInput.type = "file";

      listItemUpload.appendChild(fileInput);
      fileListUpload.appendChild(listItemUpload);
    }
  };

  reader.readAsBinaryString(file);
}
document
  .getElementById("uploadSelectedButton")
  .addEventListener("click", async () => {
    const errorMessage = document.getElementById("errorMessage");
    const loadingSpinner = document.getElementById("loadingSpinner");

    try {
      // Сбросить предыдущие ошибки
      errorMessage.textContent = "";
      // Показать спиннер во время загрузки
      loadingSpinner.style.display = "block";

      const items = fileListUpload.querySelectorAll("li");

      for (const item of items) {
        const nameWithExtension =
          item.textContent.split(":")[0].trim() + ".jpg";
        const fileInput = item.querySelector("input[type=file]");
        const file = fileInput.files[0];

        if (file) {
          const uploadUrl = await getUploadUrl("Загрузки", nameWithExtension);
          if (uploadUrl) {
            // Добавить индикатор загрузки к элементу списка
            const loadingIndicator = document.createElement("span");
            loadingIndicator.textContent = "Загрузка...";
            item.appendChild(loadingIndicator);

            try {
              await uploadFile(file, uploadUrl);
              // Изменить текст индикатора после успешной загрузки
              loadingIndicator.textContent = "Загружено";
            } catch (error) {
              // Изменить текст индикатора в случае ошибки загрузки
              loadingIndicator.textContent = "Ошибка загрузки";
              throw error;
            }
          }
        }
      }

      console.log("Все файлы успешно загружены на Яндекс Диск.");
    } catch (error) {
      errorMessage.textContent = `Ошибка: ${error.message}`;
    } finally {
      // Скрыть спиннер после завершения загрузки
      loadingSpinner.style.display = "none";
    }
  });
