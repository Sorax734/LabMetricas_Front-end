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
                motionProps={{
                    variants: {
                        exit: {
                        opacity: 0,
                        transition: {
                            duration: 0.1,
                            ease: "easeIn",
                        },
                        },
                        enter: {
                        opacity: 1,
                        transition: {
                            duration: 0.15,
                            ease: "easeOut",
                        },
                        },
                    },
                }}
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
                    {isIconOnly ? startContent : label}
                </Button>
            </Tooltip>
        </>
    );
}