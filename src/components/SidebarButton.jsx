import { motion } from 'framer-motion'

export const SidebarButton = ({
    isDanger = false,
    isActive = false,       // (Usar solamente en sidebar) ¿El botón está activo? Si sí, será color azul, sino será foreground (blanco / negro)
    label = "null",         // Texto del botón y del tooltip
    startContent,           // Ícono
    onPress,                // Función a ejecutar cuando se presione el botón
    isIconOnly              // ¿El botón es un ícono? Si sí, ignorará el texto del botón, sino lo mostrará
}) => {

    if (isIconOnly){
        return (
            <>
                <div className="">
                    {isActive && (
                        <motion.span
                        layoutId="drawer-layout"
                        className="absolute left-4 mt-3 transform w-1 h-8 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 900, damping: 60 }}
                        />
                    )}
                    <button
                        aria-label={label + " sidebar button"}
                        className={`w-20 h-14 outline-none focus-visible:bg-background-100 px-4 py-2 rounded-md ${isDanger ? 'hover:!text-danger' : 'hover:!text-background-950/60'} transition-colors duration-1000 ease-in-out`}
                        type="button"
                        onClick={onPress}
                    >
                        <div 
                            className={`
                                flex flex-col items-center gap-1 
                                ${isActive ? 'text-primary' : ''}
                            `}
                        >
                            {startContent}
                            <p className='text-xs font-medium'>{label}</p>
                        </div>
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="">
                {isActive && (
                    <motion.span
                    layoutId="drawer-layout"
                    className="absolute left-4 mt-1 transform w-1 h-7 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 900, damping: 60 }}
                    />
                )}
                <button
                    aria-label={label + " sidebar button"}
                    className={`h-9 outline-none focus-visible:bg-background-100 px-4 py-2 rounded-md -ml-4 ${isDanger ? 'hover:!text-danger-500' : 'hover:!text-background-950/60'} transition-colors duration-1000 ease-in-out`}
                    type="button"
                    onClick={onPress}
                >
                    <div 
                        className={`
                            flex items-center gap-2
                            ${isActive ? 'text-primary' : ''}
                        `}
                    >
                        {startContent}
                        <p className='text-sm font-medium'>{label}</p>
                    </div>
                </button>
            </div>
        </>
    );
}