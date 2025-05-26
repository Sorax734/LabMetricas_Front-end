import { Button } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Spinner } from "./Spinner";
import { motion } from 'framer-motion'

export const LightButton = ({
    isIconOnly = false,     // ¿El botón es un ícono? Si sí, ignorará el texto del botón, sino lo mostrará
    isDisabled = false,     // ¿El botón está deshabilitado?
    isLoading = false,      // ¿El botón está cargando?
    isSubmit = false,       // ¿El botón se ocupa en un form?
    isSmHidden = false,     // Si es true, el botón será visible solo en pantallas inferiores a sm
    isActive = false,       // (Usar solamente en sidebar) ¿El botón está activo? Si sí, será color azul, sino será foreground (blanco / negro)
    fullWidth = false,      // ¿El botón ocupará todo el ancho?
    label = "null",         // Texto del botón y del tooltip
    startContent,           // Ícono
    onPress,                // Función a ejecutar cuando se presione el botón
}) => {
    
    return (
        <>
            <Tooltip
                tooltipContent={label}
                isDisabled={!isIconOnly}
            >
                
                <Button
                    aria-label={label + " light button"}
                    fullWidth={fullWidth}
                    isIconOnly={isIconOnly}
                    isDisabled={isDisabled}
                    isLoading={isLoading}
                    onPress={onPress}
                    type={isSubmit ? "submit" : "button"}
                    spinner={<Spinner/>}
                    startContent={isLoading ? null : (isIconOnly ? null : startContent)}
                    color="primary"
                    size="md"
                    radius="sm"
                    variant="light"
                    disableRipple
                    className={`!bg-transparent
                        ${isSmHidden ? 'sm:hidden' : ''}
                        font-medium text-sm text-current
                        ${isActive ? 'text-primary' : ''}
                    `}
                    >
                    
                    {isIconOnly ? startContent : label}
                </Button>
            </Tooltip> 
        </>
    );
}