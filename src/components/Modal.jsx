import React from "react";


const Modal = ({ files, onSelectAll, onFileCheckboxChange, onPublishAndMove, onCloseModal, progress }) => {
  return (
    <div>
      <div className="backdrop"></div>
      <div className="modal">
      <div className="modal-header">
            <label  className="styled-label">
              <input className="styled-checkbox" type="checkbox" onChange={(e) => onSelectAll(e.target.checked)} />
              Выбрать все
            </label>
        <button className="close" onClick={onCloseModal}>✕</button></div>
        <ul className="list-files">
          {files.map((file, index) => (
            <li key={index} className={file.success ? "success" : file.error ? "error" : ""}>
              <img className="list-image" src={file.file} loading="lazy" alt=""/>
              <p>{file.name}</p>
              <label className="styled-label">
              {file.success && <span className="success-message">Загружено</span>}
                {file.error && <span className="error-message">Ошибка</span>}
              <input className="styled-checkbox" type="checkbox" checked={file.selected || false} onChange={(e) => onFileCheckboxChange(e.target.checked, index)} />
           
              </label>
            </li>
          ))}
        </ul>
        <div className="modal-footer">
        <button  className="button-public" onClick={onPublishAndMove}>Опубликовать</button>
        <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }}></div>
      <span>Загрузка: {progress}%</span>
    </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
