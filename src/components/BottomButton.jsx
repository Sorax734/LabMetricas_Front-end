export const BottomButton = ({
    isActive = false,
    label = "null",     // Texto del botón y del tooltip
    centerContent,      // Ícono
    onPress             // Función a ejecutar cuando se presione el botón
}) => {

    return (
        <>
            <div className='flex items-center justify-center'>
                <button
                    aria-label={label + " bottom button"}
                    className="w-20 h-14 outline-none focus:bg-default/40 px-4 py-2 rounded-md sm:hidden transition-all ease-in-out duration-500"
                    type="button"
                    onClick={onPress}
                >
                    <div 
                        className={`
                            flex flex-col items-center gap-1
                            ${isActive ? ' text-primary' : ''}
                        `}
                    >
                        {centerContent}
                        <p className='text-xs font-medium'>{label}</p>
                    </div>
                </button>
            </div>
        </>
    );
}