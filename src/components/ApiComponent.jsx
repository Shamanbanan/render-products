import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import CustomFilter from "./CustomFilter";
import ImageCard from "./ImageCard";
import Header from "./Header";

const MemoizedCustomFilter = React.memo(CustomFilter);
const MemoizedImageCard = React.memo(ImageCard);

const ApiComponent = () => {
  const api_url = "https://cloud-api.yandex.net/v1/disk/public/resources?";
  const public_key =
    "WZUgNVQeL+M19U4gABhm1JkcZBzBF3//T/F2qxLg+zh9aOasI/wM2kw2LgBvYjJGq/J6bpmRyOJonT3VoXnDag==";
  const token = "y0_AgAAAABxzwlrAAq__AAAAADwp96fqkSPH0xOSxam0NyqkdDdfKZZIKI";
  const limit = 50000;

  const [filterOptions, setFilterOptions] = useState({
    seria: [],
    comp: [],
    color: [],
    profileColor: [],
    height: [],
    width: [],
    depth: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    seria: [],
    comp: [],
    color: [],
    profileColor: [],
    height: [],
    width: [],
    depth: [],
  });

  const resetFilters = () => {
    setSelectedFilters({
      seria: [],
      comp: [],
      color: [],
      profileColor: [],
      height: [],
      width: [],
      depth: [],
    });
  };

  const [imagesData, setImagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYandexDiskData = async (path) => {
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
  
        if (response.status !== 200) {
          throw new Error(
            `Ошибка: Неправильный статус ответа от сервера: ${response.status}`
          );
        }
  
        const items = response.data._embedded.items;
        const filterOptionsMap = {
          seria: new Set(),
          comp: new Set(),
          color: new Set(),
          profileColor: new Set(),
          height: new Set(),
          width: new Set(),
          depth: new Set(),
        };
  
        // Создаем массив асинхронных запросов для каждого элемента
        const requests = items.map(async (item) => {
          const [seria, comp, color, profileColor, height, width, depth] =
            item.name.split("_");
  
          filterOptionsMap.seria.add(seria);
          filterOptionsMap.comp.add(comp);
          filterOptionsMap.color.add(color);
          filterOptionsMap.profileColor.add(profileColor);
          filterOptionsMap.height.add(height);
          filterOptionsMap.width.add(width);
          filterOptionsMap.depth.add(depth);
        });
  
        // Ожидаем завершения всех асинхронных запросов
        await Promise.all(requests);
  
        // Обновляем состояние компонента после завершения всех запросов
        setFilterOptions({
          seria: Array.from(filterOptionsMap.seria),
          comp: Array.from(filterOptionsMap.comp),
          color: Array.from(filterOptionsMap.color),
          profileColor: Array.from(filterOptionsMap.profileColor),
          height: Array.from(filterOptionsMap.height),
          width: Array.from(filterOptionsMap.width),
          depth: Array.from(filterOptionsMap.depth),
        });
  
        setImagesData(items);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
  
    // Вызываем функцию для получения списка карточек при загрузке компонента
    fetchYandexDiskData("/Рендеры");
  }, []); 

  const handleDownloadExcel = () => {
    // Создаем пустую книгу Excel
    const wb = XLSX.utils.book_new();
    
    // Преобразуем данные в формат, понимаемый библиотекой XLSX
    const wsData = filteredImages.map((item) => {
      return [
        item.name,
        item.public_url,
      ];
    });
  
    // Создаем лист с данными
    const ws = XLSX.utils.aoa_to_sheet([["Имя файла", "Публичная ссылка"], ...wsData]);
    
    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(wb, ws, "Рендеры");
  
    // Сохраняем книгу в формате Excel
    XLSX.writeFile(wb, "Рендеры.xlsx");
  };
  

  const filteredImages = imagesData.filter((item) => {
    const [seria, comp, color, profileColor, height, width, depth] =
      item.name.split("_");

    return (
      (selectedFilters.seria.length === 0 ||
        selectedFilters.seria.includes(seria)) &&
      (selectedFilters.comp.length === 0 ||
        selectedFilters.comp.includes(comp)) &&
      (selectedFilters.color.length === 0 ||
        selectedFilters.color.includes(color)) &&
      (selectedFilters.profileColor.length === 0 ||
        selectedFilters.profileColor.includes(profileColor)) &&
      (selectedFilters.height.length === 0 ||
        selectedFilters.height.includes(height)) &&
      (selectedFilters.width.length === 0 ||
        selectedFilters.width.includes(width)) &&
      (selectedFilters.depth.length === 0 ||
        selectedFilters.depth.includes(depth))
    );
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="page-container"> 
      <main className="content-container">
        <div className="filter-container">
          <div className="filter-column seria-column">
            <MemoizedCustomFilter
              title="Серия"
              options={filterOptions.seria}
              selectedOptions={selectedFilters.seria}
              onToggleOption={(option) => {
                if (selectedFilters.seria.includes(option)) {
                  setSelectedFilters({
                    ...selectedFilters,
                    seria: selectedFilters.seria.filter(
                      (item) => item !== option
                    ),
                  });
                } else {
                  setSelectedFilters({
                    ...selectedFilters,
                    seria: [...selectedFilters.seria, option],
                  });
                }
              }}
              onClear={() => {
                setSelectedFilters({ ...selectedFilters, seria: [] });
              }}
            />
          </div>
          <div className="filter-column">
            <MemoizedCustomFilter
              title="Компоновка"
              options={filterOptions.comp}
              selectedOptions={selectedFilters.comp}
              onToggleOption={(option) => {
                if (selectedFilters.comp.includes(option)) {
                  setSelectedFilters({
                    ...selectedFilters,
                    comp: selectedFilters.comp.filter(
                      (item) => item !== option
                    ),
                  });
                } else {
                  setSelectedFilters({
                    ...selectedFilters,
                    comp: [...selectedFilters.comp, option],
                  });
                }
              }}
              onClear={() => {
                setSelectedFilters({ ...selectedFilters, comp: [] });
              }}
            />
          </div>
          <div className="filter-column">
            <MemoizedCustomFilter
              title="Цвет"
              options={filterOptions.color}
              selectedOptions={selectedFilters.color}
              onToggleOption={(option) => {
                if (selectedFilters.color.includes(option)) {
                  setSelectedFilters({
                    ...selectedFilters,
                    color: selectedFilters.color.filter(
                      (item) => item !== option
                    ),
                  });
                } else {
                  setSelectedFilters({
                    ...selectedFilters,
                    color: [...selectedFilters.color, option],
                  });
                }
              }}
              onClear={() => {
                setSelectedFilters({ ...selectedFilters, color: [] });
              }}
            />
            <MemoizedCustomFilter
              title="Цвет профиля"
              options={filterOptions.profileColor}
              selectedOptions={selectedFilters.profileColor}
              onToggleOption={(option) => {
                if (selectedFilters.profileColor.includes(option)) {
                  setSelectedFilters({
                    ...selectedFilters,
                    profileColor: selectedFilters.profileColor.filter(
                      (item) => item !== option
                    ),
                  });
                } else {
                  setSelectedFilters({
                    ...selectedFilters,
                    profileColor: [...selectedFilters.profileColor, option],
                  });
                }
              }}
              onClear={() => {
                setSelectedFilters({ ...selectedFilters, profileColor: [] });
              }}
            />
          </div>
          <div className="filter-column">
            <MemoizedCustomFilter
              title="Высота"
              options={filterOptions.height}
              selectedOptions={selectedFilters.height}
              onToggleOption={(option) => {
                if (selectedFilters.height.includes(option)) {
                  setSelectedFilters({
                    ...selectedFilters,
                    height: selectedFilters.height.filter(
                      (item) => item !== option
                    ),
                  });
                } else {
                  setSelectedFilters({
                    ...selectedFilters,
                    height: [...selectedFilters.height, option],
                  });
                }
              }}
              onClear={() => {
                setSelectedFilters({ ...selectedFilters, height: [] });
              }}
            />
            <MemoizedCustomFilter
              title="Ширина"
              options={filterOptions.width}
              selectedOptions={selectedFilters.width}
              onToggleOption={(option) => {
                if (selectedFilters.width.includes(option)) {
                  setSelectedFilters({
                    ...selectedFilters,
                    width: selectedFilters.width.filter(
                      (item) => item !== option
                    ),
                  });
                } else {
                  setSelectedFilters({
                    ...selectedFilters,
                    width: [...selectedFilters.width, option],
                  });
                }
              }}
              onClear={() => {
                setSelectedFilters({ ...selectedFilters, width: [] });
              }}
            />
            <MemoizedCustomFilter
              title="Глубина"
              options={filterOptions.depth}
              selectedOptions={selectedFilters.depth}
              onToggleOption={(option) => {
                if (selectedFilters.depth.includes(option)) {
                  setSelectedFilters({
                    ...selectedFilters,
                    depth: selectedFilters.depth.filter(
                      (item) => item !== option
                    ),
                  });
                } else {
                  setSelectedFilters({
                    ...selectedFilters,
                    depth: [...selectedFilters.depth, option],
                  });
                }
              }}
              onClear={() => {
                setSelectedFilters({ ...selectedFilters, depth: [] });
              }}
            />
          </div>
        </div>
        <div className="wrapper-content">
        <Header onResetFilters={resetFilters} downloadExcel={handleDownloadExcel}/>
        <div className="image-container">
          {filteredImages.map((item) => (
            <MemoizedImageCard item={item} key={item.name} />
          ))}
        </div>
        </div>
      </main>
    </div>
  );
};

export default ApiComponent;
