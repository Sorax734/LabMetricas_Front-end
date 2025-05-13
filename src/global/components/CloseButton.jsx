import { XMarkIcon } from "@heroicons/react/24/solid";
import { Button, Tooltip } from "@heroui/react";

export const CloseButton = ({tooltipPlacement, onPress}) => {
    return (
        <>
            <Tooltip
                showArrow
                radius='sm'
                color="foreground"
                className="text-sm font-medium"
                placement={tooltipPlacement}
                closeDelay={0}
                content={ 
                    <div className="h-6 flex justify-center items-center mx-1">
                        <p>Cerrar</p> 
                    </div>
                }
                delay={0}
                >
                <Button
                    isIconOnly
                    size="sm"
                    radius="sm"
                    variant="light"
                    onPress={onPress}
                    >
                    <XMarkIcon className='size-5' />
                </Button>
            </Tooltip>
        </>
    );
}