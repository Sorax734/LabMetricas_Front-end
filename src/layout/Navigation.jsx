import { BottomButton } from "../components/BottomButton"
import { LightButton } from "../components/LightButton"
import { useIsIconOnly } from "../hooks/useIsIconOnly"
import { ArrowLeftStartOnRectangleIcon, Bars3Icon, ClockIcon, HomeIcon, } from '@heroicons/react/24/solid'
import { DocumentMultipleFilled, PeopleFilled, PersonFilled,} from '@fluentui/react-icons';
import { SecondaryButton } from "../components/SecondaryButton";
import { Drawer, DrawerBody, DrawerFooter } from "../components/Drawer";
import { Button, Divider, Tooltip } from "@heroui/react";

const home = {
    label: "Inicio",
    icon: <HomeIcon className='size-5' />,
    path: "/"
}

const profile = {
    label: "Mi perfil",
    icon: <PersonFilled className='size-5' />,
    path: "/Profile"
}

const adminNavigation = [
    home,
    profile,
    {
        label: "Usuarios",
        icon: <PeopleFilled className='size-5' />,
        path: "/Users"
    }
]

const operadorNavigation = [
    home,
    profile,
    {
        label: "Historial",
        icon: <ClockIcon className='size-5' />,
        path: "/History"
    }
]

const supervisorNavigation = [
    home,
    profile,
    {
        label: "Documentos",
        icon: <DocumentMultipleFilled className='size-5' />,
        path: "/Documents"
    }
]

export const Navigation = ({ role, type }) => {
    const isIconOnly = useIsIconOnly()

    let navigation

    switch (role){
        case "Admin": navigation = adminNavigation; break;
        case "Supervisor": navigation = supervisorNavigation; break;
        case "Operador": navigation = operadorNavigation; break;

        default: navigation = []
    }

    if (type === "Bottom"){
        return (
            <>
                {navigation.map(({ label, icon, path }) => (
                    <BottomButton
                        isActive={false}
                        key={label}
                        label={label}
                        centerContent={icon}
                        onPress={() => { alert("Path: " + path) }}
                    />
                ))}
            </>
        );
    } 

    return (
        <>
            {navigation.map(({ label, icon, path }) => (
                <LightButton
                    isActive={false}
                    isIconOnly={type === "Drawer" ? false : isIconOnly}
                    key={label}
                    label={label}
                    startContent={icon}
                    onPress={() => { alert("Path: " + path) }}
                />
            ))}
        </>
    );
}

export const AppBottomNavigation = ({
    role
}) => {

    return (
        <>
            <div className="flex-shrink-0 h-16 sm:hidden rounded-t-xl
            shadow-[0px_-20px_40px_-10px_#e6e6e6] 
            dark:shadow-[0px_-10px_40px_-10px_#1a1a1a]">
                <div className='flex h-full w-full justify-center px-2 xs:space-x-4'>
                    <Navigation role={role} type="Bottom"/>
                </div>
            </div>
        </>
    );
}

export const AppSidebarNavigation = ({
    role, name, email, onOpen
}) => {
    const isIconOnly = useIsIconOnly()

    return (
        <>
            <div className='lg:w-56 w-[72px] h-full bg-background-950 py-8 px-4 rounded-r-xl 
            hidden sm:flex flex-col justify-between items-center 
            transition-all ease-out duration-500 
            shadow-[20px_0px_40px_-10px_#e6e6e6] dark:shadow-[10px_0px_40px_-10px_#1a1a1a] 
            overflow-y-auto overflow-x-hidden [scrollbar-width:none]'>
                
                <div className='w-full'>
                    <div className='w-full flex flex-col lg:items-start items-center'>
                        <div className='w-full hidden lg:flex px-4 items-start'>
                            <p className="text-base font-bold break-words line-clamp-1">Nombre del sistema</p>
                        </div>

                        <Tooltip
                            offset={15}
                            showArrow
                            radius='sm'
                            color="default"
                            className="text-sm font-medium"
                            placement="right"
                            closeDelay={0}
                            delay={0}
                            content={ 
                                <div className="h-6 flex justify-center items-center mx-1">
                                    <p>Menú</p> 
                                </div>
                            }
                        >
                            <Button
                                isIconOnly
                                size="md"
                                radius="sm"
                                variant="flat"
                                color="secondary"
                                className="font-medium hidden sm:flex lg:hidden !outline-none focus:bg-secondary/40 focus:text-secondary-700"
                                onPress={onOpen}
                            >
                                <Bars3Icon className='size-5' />
                            </Button>
                        </Tooltip>
                    </div>

                    <Divider className='lg:hidden mt-5 mb-[11px]'/>
                    
                    <div className='space-y-1 flex flex-col lg:items-start items-center lg:py-8'>
                        <p className='text-xs items-start hidden lg:flex text-background-500 px-4 break-words line-clamp-1'>Páginas</p>
                        <Navigation role={role}/>
                    </div>

                    <Divider className='lg:hidden mt-[11px] mb-5'/>
                </div>

                <div className='w-full'>
                    <div className='flex flex-col items-center gap-4 px-4'>
                        <div className='w-full hidden flex-col lg:flex items-start gap-1'>
                            <p className="text-sm font-medium break-all line-clamp-1">{name}</p>
                            <p className="text-xs text-background-500 break-all line-clamp-1">{email}</p>
                        </div>

                        <SecondaryButton
                            fullWidth
                            isIconOnly={isIconOnly}
                            label="Cerrar sesión"
                            onPress={() => alert("Presionaste el botón secundario")}
                            startContent={<ArrowLeftStartOnRectangleIcon className='size-5' />}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export const AppDrawerNavigation = ({
    role,
    isOpen,
    onOpenChange,
    onClose,
    name, 
    email
}) => {
    
    return (
        <>
            <Drawer
                title="Nombre del sistema" 
                isOpen={isOpen} 
                onOpenChange={onOpenChange} 
                onClose={onClose} 
                size='xs' 
                placement='left'
            >
                <DrawerBody>
                    <div className='space-y-1 flex -mx-4 flex-col items-start'>
                        <p className='text-xs items-start text-background-500 px-4 break-words line-clamp-1'>Páginas</p>
            
                        <Navigation role={role} type="Drawer"/>
                    </div>
                </DrawerBody>
                <DrawerFooter>
                    <div className='flex flex-col items-center gap-4'>
                        <div className='w-full flex-col flex items-start gap-1'>
                            <p className="text-sm font-medium break-all line-clamp-1">{name}</p>
                            <p className="text-xs text-background-500 break-all line-clamp-1">{email}</p>
                        </div>
            
                        <SecondaryButton
                            fullWidth
                            label="Cerrar sesión"
                            onPress={() => alert("Presionaste el botón secundario")}
                            startContent={<ArrowLeftStartOnRectangleIcon className='size-5' />}
                        />
                    </div>
                </DrawerFooter>
            </Drawer>
        </>
    );
}