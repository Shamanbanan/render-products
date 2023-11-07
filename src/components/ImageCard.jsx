import React from 'react';
import { FaDownload } from "react-icons/fa";
import { useInView } from 'react-intersection-observer';

const ImageCard = React.memo(({ item }) => {

    const [seria, comp, color, height, width, depth] = item.name.split("_");
    const [ref, inView] = useInView({
        triggerOnce: true, // Позволяет загрузить изображение только один раз, когда оно становится видимым
        threshold: 0.5, // Порог видимости: 10%
    });

    return (
        <div
            ref={ref}
            className= "image-card"
        >
            <span className="card-title">
                <p>{seria}</p>
                <a href={item.file} className="icons-download"><FaDownload/></a>
            </span>
            <div className="card-content">
                <div className="card-size">
                    <p>В: {height}</p>
                    <p>Ш: {width}</p>
                    <p>Г: {depth}</p>
                </div>
                {inView && <img src={item.preview} alt="" />}
            </div>
            <div className="image-details">
                <p>Компоновка: {comp}</p>
                <p>Цвет: {color}</p>
            </div>
        </div>
    );
});

export default ImageCard;
