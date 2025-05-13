import { Button, Tooltip } from "@heroui/react";

export const PrimaryButton = ({isIconOnly, startContent, tooltipPlacement, tooltipLabel, onPress, label, isSubmit}) => {
    return (
        <>
            <Tooltip
                isDisabled={!isIconOnly}
                showArrow
                radius='sm'
                color="foreground"
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
                    size="md"
                    radius="sm"
                    variant="shadow"
                    color="primary"
                    className="font-medium hover:-translate-y-1"
                    onPress={onPress}
                    startContent={isIconOnly ? "" : startContent}
                    >
                    {isIconOnly ? startContent : label}
                </Button>
            </Tooltip>
        </>
    );
}