// src/component/BinImage.jsx
import React, { useEffect, useState } from "react";

function BinImage({ url, alt }) {
    const [imgSrc, setImgSrc] = useState(null);

    useEffect(() => {
        if (!url) return;

        fetch(url)
            .then((res) => res.blob())
            .then((blob) => {
                const objectUrl = URL.createObjectURL(blob);
                setImgSrc(objectUrl);
            })
            .catch(() => setImgSrc(null));
    }, [url]);

    return (
        <img
            src={imgSrc || "/no-image.png"}
            alt={alt}
            className="h-full w-full object-contain"
        />
    );
}

export default BinImage;
