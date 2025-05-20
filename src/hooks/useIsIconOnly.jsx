import { useState, useEffect } from 'react';

export const useIsIconOnly = () => {
    // true si < 1024px, false si >= 1024px
    const [isIconOnly, setIsIconOnly] = useState(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        return !mq.matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)');

        const handleChange = e => {
            // e.matches === true cuando >=1024px → isIconOnly = false
            setIsIconOnly(!e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return isIconOnly;
};