import { Button, Tooltip } from "@heroui/react";

export const TextButton = ({isIconOnly, startContent, tooltipPlacement, tooltipLabel, onPress, isActive, label, isSubmit}) => {
    return (
        <>
            <Tooltip
                isDisabled={!isIconOnly}
                showArrow
                radius='sm'
                color={isActive ? "primary" : "foreground"}
                className="text-sm font-medium"
                placement={tooltipPlacement}
                closeDelay={0}
                content={ 
                    <div className="h-6 flex justify-center items-center mx-1">
                        <p>{tooltipLabel}</p> 
                    </div>
                }
                delay={0}
                >
                <Button
                    type={isSubmit ? "submit" : "button"}
                    isIconOnly={isIconOnly}
                    disableRipple
                    size="md"
                    radius="sm"
                    variant="light"
                    className={"font-medium text-sm " + (isActive ? "text-primary" : "")}
                    onPress={onPress}
                    startContent={isIconOnly ? "" : startContent}
                    >
                    {isActive && (<span className="absolute rounded-xl left-0 top-2 bottom-2 w-1 bg-primary" />)}
                    {isIconOnly ? startContent : label}
                </Button>
            </Tooltip>
        </>
    );
}