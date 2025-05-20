import { Tooltip as HeroUITooltip } from "@heroui/react";

export const Tooltip = ({
    isDisabled = false,             // ¿Se deshabilitará el tooltip?
    tooltipPlacement = "right",     // Posición del tooltip
    tooltipContent = "null",        // Texto del tooltip
    children                        // Botón
}) => {

    return (
        <>
            <HeroUITooltip
                isDisabled={isDisabled}
                showArrow
                shadow="lg"
                radius='sm'
                color="default"
                className="text-sm font-medium"
                placement={tooltipPlacement}
                closeDelay={0}
                delay={0}
                content={ 
                    <div className="flex justify-center items-center m-1">
                        {tooltipContent}
                    </div>
                }
            >
                {children}
            </HeroUITooltip>
        </>
    );
}