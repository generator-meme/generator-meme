import { useState, useEffect, useRef } from 'react';

export default function useComponentVisible(initialIsVisible) {
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            // const page = document.getElementsByClassName('page');
            // page.classList.remove('contrast-effect');
            // document.body.classList.remove('contrast-effect');
            const note = document.querySelector(".dim_filter");
            const dim_element = document.getElementById("dim");
            dim_element.style.width = "0px";
            dim_element.style.height = "0px";
            dim_element.classList.remove("dim_filter");

            setIsComponentVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return [ ref, isComponentVisible, setIsComponentVisible ];
}