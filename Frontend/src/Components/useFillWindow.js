import { useLayoutEffect, useRef, useState } from 'react';

// Makes an element fill the window from where it starts down to the bottom, so the page itself doesn't scroll and the
// element's columns can scroll on their own. Returns [ref, style] to put on the element. It re-measures when the
// window is resized and when anything above it on the page appears or changes height (e.g. a form growing a field).
const useFillWindow = () => {
    const ref = useRef(null);
    const [top, setTop] = useState(0);

    useLayoutEffect(() => {
        const element = ref.current;
        if(!element)
        {
            return;
        }
        const measure = () => setTop(element.getBoundingClientRect().top + window.scrollY);
        measure();

        window.addEventListener('resize', measure);
        // anything above it appearing (e.g. a form rendered once its data loads) or changing height changes the page's
        // height, so watching the page catches it; the element's own top doesn't depend on its height, so this settles
        const observer = new ResizeObserver(measure);
        observer.observe(document.body);
        return () => {
            window.removeEventListener('resize', measure);
            observer.disconnect();
        };
    }, []);

    return [ref, { height: `calc(100vh - ${top}px)` }];
}

export default useFillWindow;
