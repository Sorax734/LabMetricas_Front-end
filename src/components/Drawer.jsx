import { CloseButton } from "./CloseButton";
import { 
    Drawer as HeroUIDrawer,
    DrawerContent as HeroUIDrawerContent,
} from "@heroui/react";

export const DrawerBody = ({ children }) => {
    return (
        <>
            <div className='flex-1 py-8'>
                {children}
            </div>
        </>
    );
}

export const DrawerFooter = ({ children }) => {
    return (
        <>
            <div>
                {children}
            </div>
        </>
    );
}

export const Drawer = ({ 
    title = "null",             // Título del drawer
    size = "sm",                // Tamaño del drawer
    placement = "right",        // Posición del drawer
    backdrop = "transparent",   // Tipo de fondo del drawer
    children,                   // Espacio para contener el DrawerBody y el DrawerFooter
    isOpen,
    onOpenChange,
    onClose,
}) => {

    const x = (placement) => {
        if (placement === "left") return -200;
        if (placement === "right") return 200;
        return 0;
    }

    const y = (placement) => {
        if (placement === "top") return -200;
        if (placement === "bottom") return 200;
        return 0;
    }

    return (
        <HeroUIDrawer
            hideCloseButton
            isOpen={isOpen} 
            radius='sm'
            className={size === "xs" ? "w-62" : ""}
            backdrop={backdrop}
            size={size}
            onOpenChange={onOpenChange} 
            placement={placement}
            motionProps={{ 
                variants: {
                    enter: {
                        x: 0,
                        y: 0,
                        opacity: 1,
                        transition: {
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            y: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        },
                    },
                    exit: {
                        x: x(placement),
                        y: y(placement),
                        opacity: 0,
                        transition: {
                            duration: 0.3,
                            ease: "easeIn"
                        }
                    }
                }
            }}
        >
            <HeroUIDrawerContent className="p-8 bg-background-950 
            transition-all ease-out duration-500 
            overflow-y-auto overflow-x-hidden [scrollbar-width:none]"
            >
                <div className='w-full flex items-start justify-between gap-4'>
                    <p className="text-base font-bold">{title}</p>
                    <CloseButton tooltipPlacement="right" onPress={onClose}/>
                </div>
                {children}
            </HeroUIDrawerContent>
        </HeroUIDrawer>
    );
}