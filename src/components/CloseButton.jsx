import { XMarkIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "./Tooltip";

export const CloseButton = ({ 
    onPress     // Función a ejecutar cuando se presione el botón
}) => {
    
    return (
        <>
            <Tooltip
                tooltipContent="Cerrar"
            >
                <button
                    aria-label="Botón para cerrar los drawer"
                    className="outline-none text-background-500 focus:text-current transition-all ease-in-out duration-500"
                    type="button"
                    onClick={onPress}
                >
                    <XMarkIcon className='size-5' />
                </button>
            </Tooltip>
        </>
    );
}