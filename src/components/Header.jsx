import React, { useState } from "react";
import Modal from "./Modal";
import { Sema } from "async-sema";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faUndo, faFileExcel } from '@fortawesome/free-solid-svg-icons';


const token = "y0_AgAAAABxzwlrAAq__AAAAADwp96fqkSPH0xOSxam0NyqkdDdfKZZIKI";

const Header = ({onResetFilters, downloadExcel}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progress, setProgress] = useState(0);

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
        if (response.status === 409) {
          throw new Error("Ошибка при перемещении файла: 409 (Conflict)");
        }
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
      throw error;
    }
  }

  // Логика открытия модального окна и загрузки файлов
  const handleOpenModal = async () => {
    try {
      const folder = "Загрузки рендер";
      const limit = 1000;
      const files = await fetchFiles(folder, limit);
      // Устанавливаем полученные файлы
      setSelectedFiles(files);
      setProgress(0);
      setModalVisible(true);
    } catch (error) {
      console.error("Ошибка при загрузке файлов:", error);
    }
  };

  // Обновляем состояние всех файлов для выбора всех или снятия выбора
  const handleSelectAll = (isChecked) => {
    // Логика выбора всех файлов
    const updatedFiles = selectedFiles.map((file) => ({
      ...file,
      selected: isChecked,
    }));
    setSelectedFiles(updatedFiles);
  };

  // Обработка изменений состояния чекбокса файла
  const handleFileCheckboxChange = (isChecked, index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles[index].selected = isChecked;
    setSelectedFiles(updatedFiles);
  };

  // Логика публикации и перемещения выбранных файлов
  const handlePublishAndMove = async () => {
    try {
      const destinationFolder = "Ценообразование Е1/Рендеры";
      const selectedFilesToPublish = selectedFiles.filter(
        (file) => file.selected
      );
      const totalFiles = selectedFilesToPublish.length;
      let completedFiles = 0;
      // Количество параллельных запросов
      const concurrency = 5;

      const sema = new Sema(concurrency);

      // Публикация и перемещение файлов
      await Promise.all(
        selectedFilesToPublish.map(async (file) => {
          const fileName = file.name;
          const destinationPath = `${destinationFolder}/${fileName}`;

          try {
            await sema.acquire();
            await publishFile(file.path);
            await moveFile(file.path, destinationPath);
            file.success = true;
            completedFiles++;
            const newProgress = (completedFiles / totalFiles) * 100;
            setProgress(newProgress);
          } catch (error) {
            file.error = error.message;
            console.error(
              `Ошибка при публикации и перемещении файла ${fileName}: ${error.message}`
            );
            file.error = true;
          } finally {
            sema.release();
          }
        })
      );

      console.log("Выбранные файлы успешно опубликованы и перемещены.");

      // Обновляем состояние selectedFiles, чтобы применить стили к успешно перемещенным файлам
      setSelectedFiles([...selectedFiles]);
    } catch (error) {
      console.error("Ошибка при публикации и перемещении файлов:", error);
    }
  };

  // Логика закрытия модального окна
  const handleCloseModal = () => {
    setModalVisible(false);
  };


  return (
    <div className="header">
      <button className="header-buttons reset" onClick={onResetFilters} ><FontAwesomeIcon className="icons" icon={faUndo}/> Сбросить все</button>
      <button className="header-buttons public" onClick={handleOpenModal}  title=""><FontAwesomeIcon className="icons" icon={faUpload} /> Рендеры на публикацию</button>
      <button className="header-buttons excel" onClick={downloadExcel}  title=""><FontAwesomeIcon className="icons" icon={faFileExcel} /> Скачать Excel</button>
      {modalVisible && (
        <Modal
          files={selectedFiles}
          onSelectAll={handleSelectAll}
          onFileCheckboxChange={handleFileCheckboxChange}
          onPublishAndMove={handlePublishAndMove}
          onCloseModal={handleCloseModal}
          progress={progress}
        />
      )}
    </div>
  );
};

export default Header;
