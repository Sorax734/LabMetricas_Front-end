import { AlertFilled, Dismiss12Filled, DocumentMultipleFilled, EmojiHandFilled, InfoSparkleFilled, KeyResetFilled, PeopleFilled, PersonArrowLeftFilled, PersonFilled, SearchFilled } from "@fluentui/react-icons"
import { ClockIcon, HomeIcon, MoonIcon, SunIcon } from "@heroicons/react/24/solid"
import { useLocation, useNavigate } from "react-router-dom"
import { useIsIconOnly } from "../hooks/useIsIconOnly"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow, useDisclosure, useDraggable } from "@heroui/react"
import { SidebarButton } from "../components/SidebarButton"
import { BottomButton } from "../components/BottomButton"
import { useTheme } from "@heroui/use-theme"
import { useRef, useState } from "react"
import { CloseButton } from "../components/CloseButton"
import { PrimaryButton } from "../components/PrimaryButton"

const home = {
    label: "Inicio",
    icon: <HomeIcon className='size-5' />,
    path: "/App"
}

const profile = {
    label: "Mi perfil",
    icon: <PersonFilled className='size-5' />,
    path: "/App/Profile"
}

const adminNavigation = [
    home,
    profile,
    {
        label: "Usuarios",
        icon: <PeopleFilled className='size-5' />,
        path: "/App/Users"
    }
]

const operadorNavigation = [
    home,
    profile,
    {
        label: "Historial",
        icon: <ClockIcon className='size-5' />,
        path: "/App/History"
    }
]

const supervisorNavigation = [
    home,
    profile,
    {
        label: "Documentos",
        icon: <DocumentMultipleFilled className='size-5' />,
        path: "/App/Documents"
    }
]

export const UserProfile = ({user}) => {
    const { theme, setTheme } = useTheme();
    const tema = `Cambiar a tema ${theme !== 'dark' ? 'oscuro' : 'claro'}`
    const [isOpen, setIsOpen] = useState(false);

    let navigate = useNavigate()

    let navigation

    switch (user.role){
        case "ADMIN": navigation = adminNavigation; break;
        case "SUPERVISOR": navigation = supervisorNavigation; break;
        case "OPERADOR": navigation = operadorNavigation; break;

        default: navigation = []
    }

    return (
        <>
            <Dropdown placement="bottom" className="bg-background-50 w-64 transition-colors duration-1000 ease-in-out
                shadow-[0px_20px_100px_10px_rgba(0,0,0,0.1)]
                dark:shadow-[0px_20px_100px_20px_rgba(255,255,255,0.05)]" 
                offset={33} crossOffset={-92} shadow="none" radius="sm">
                <DropdownTrigger>
                    <Button
                        variant="light"
                        isIconOnly
                        radius="sm"
                    >
                        <Image
                            src={user.image}
                            className="object-cover brightness-125"
                            radius="sm"
                            width={40}
                            height={40}
                        />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="light" itemClasses={{base:"mt-[6px]"}}>
                {/* <DropdownSection title="Tus páginas" classNames={{ heading: "text-background-500 font-normal"}}>
                        {navigation.map(({ label, icon, path }) => (
                            <DropdownItem 
                                className="rounded-md transition-all !duration-1000 ease-in-out "
                                key={path}
                                startContent={icon}
                                onPress={() => navigate(path)}
                            >
                                {label}
                            </DropdownItem>
                        ))}
                    </DropdownSection>
    */}
                    <DropdownSection title="Opciones" classNames={{ heading: "text-background-500 font-normal"}}>
                        <DropdownItem 
                            className="rounded-md transition-all !duration-1000 ease-in-out "
                            key="notifications"
                            startContent={<AlertFilled className="size-5"/>}
                            //onPress={() => navigate("/App/Profile")}
                        >
                            Notificaciones
                        </DropdownItem>

                        <DropdownItem 
                            className="rounded-md transition-all !duration-1000 ease-in-out "
                            key="step-by-step"
                            startContent={<EmojiHandFilled className="size-5"/>}
                            //onPress={() => navigate("/App/Profile")}
                        >
                            Paso a paso
                        </DropdownItem>

                        <DropdownItem 
                            className="rounded-md transition-all !duration-1000 ease-in-out "
                            key="password"
                            startContent={<KeyResetFilled className="size-5"/>}
                            //onPress={() => navigate("/App/Profile")}
                        >
                            Cambiar contraseña
                        </DropdownItem>

                        <DropdownItem
                            className="rounded-md transition-all !duration-1000 ease-in-out "
                            key="theme"
                            startContent={theme !== 'dark' ? <MoonIcon className="size-5 text-current" /> : <SunIcon className="size-5 text-current" />}
                            onPress={() => {theme === 'dark' ? setTheme('light') : setTheme('dark') }}
                        >
                            {tema}
                        </DropdownItem>

                        <DropdownItem 
                            className="rounded-md transition-all !duration-1000 ease-in-out "
                            key="logout"
                            color="danger"
                            startContent={<PersonArrowLeftFilled className="size-5"/>}
                            onPress={() => setIsOpen(true)}
                        >
                            Cerrar sesión
                        </DropdownItem>
                    </DropdownSection>
            
                    <DropdownSection title="Identificado como:" classNames={{ heading: "text-background-500 font-normal"}}>
                        <DropdownItem 
                            className="rounded-md transition-all !duration-1000 ease-in-out "
                            key="signed-in-as"
                            textValue="profile"
                            onPress={() => navigate("/App/Profile")}
                        >
                            {
                                <div className="flex gap-4">
                                    <Image
                                        src={user.image}
                                        className="object-cover brightness-125"
                                        radius="sm"
                                        width={40}
                                        height={40}
                                    />
                                    <div>
                                        <p className="text-base font-medium">{user.name}</p>
                                        <p className="text-xs text-background-500">{user.email}</p>
                                    </div>
                                </div>
                            }
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
            <LogOutModal isOpen={isOpen} onOpenChange={setIsOpen}/>
        </>
    );
}

export const AppLayout = ({ 
    children,
    user
}) => {
    let navigate = useNavigate()
    const isIconOnly = useIsIconOnly()
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    let navigation

    switch (user.role){
        case "ADMIN": navigation = adminNavigation; break;
        case "SUPERVISOR": navigation = supervisorNavigation; break;
        case "OPERADOR": navigation = operadorNavigation; break;

        default: navigation = []
    }

    const getIsActive = (path) => {
        // Caso especial para la ruta de inicio
        if (path === home.path) {
            return location.pathname === path;
        }
        
        // Para otras rutas: match exacto o sub-rutas
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <>
            {/* PANTALLA */}
            <div className="flex flex-col w-screen h-screen transition-colors duration-1000 ease-in-out bg-background p-4 gap-4 overflow-hidden">
                {/* NAVBAR */}
                <div className="flex-shrink-0 h-[72px] bg-transparent rounded-lg flex justify-between
                shadow-[0px_0px_100px_10px_rgba(0,0,0,0.1)]
                dark:shadow-[0px_0px_100px_20px_rgba(255,255,255,0.05)]">
                    <div className="px-4 items-center w-full gap-4 hidden sm:flex">
                        <p className="text-lg font-bold">Punto de control Lab Métricas</p>
                    </div>
                    <div className="px-4 flex justify-end items-center w-full gap-4">
                        {/**Se necesita cambiar el input para después */}
                        <Input
                            classNames={{ input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal", mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                            className="w-1 grow sm:max-w-xs"
                            color="primary"
                            name="search"
                            labelPlacement="inside"
                            type="text"
                            radius="sm"
                            size="md"
                            variant="bordered"
                            maxLength={100}
                            placeholder="Buscar usuarios por nombre..."
                            endContent={<SearchFilled className='size-5 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:text-danger' />}
                        />
                        <UserProfile user={user}/>
                    </div>
                </div>

                <div className="flex flex-1 min-h-0 bg-transparent gap-4">
                    {/* SIDEBAR */}
                    <div className="flex-shrink-0 flex-col lg:w-56 w-20 hidden sm:flex h-full transition-colors duration-1000 ease-in-out bg-background rounded-lg overflow-y-auto overflow-x-hidden
                    [&::-webkit-scrollbar]:lg:w-2
                    [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-background-300
                    shadow-[0px_40px_100px_10px_rgba(0,0,0,0.1)] 
                    dark:shadow-[0px_40px_100px_20px_rgba(255,255,255,0.05)]">
                        <div className="flex-shrink-0 lg:px-6 lg:pt-8 w-full lg:items-start items-center flex flex-col pt-4 gap-1">
                            <p className="text-lg hidden lg:flex font-bold pb-5">Bienvenido de vuelta {user.name}</p>
                            <p className="text-xs text-background-500 hidden lg:flex">Tus páginas</p> {/*header */}
                            
                            {navigation.map(({ label, icon, path }) => (
                                <SidebarButton
                                    isActive={getIsActive(path)}
                                    isIconOnly={isIconOnly}
                                    key={label}
                                    label={label}
                                    startContent={icon}
                                    onPress={() => {navigate(path);}}
                                />
                            ))}
                        </div>
                        <ScrollShadow className="flex-1 lg:pt-6 lg:pl-6
                        [&::-webkit-scrollbar]:lg:w-2
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-background-300">
                            <div className="w-full h-full lg:pr-6 lg:justify-normal justify-center flex">
                                <p className="text-xs text-background-500 hidden lg:flex">Documentos</p> {/*header */}
                                {/**Aqui se colocaran los documentos del usuario */}
                            </div>
                        </ScrollShadow>
                        <div className="flex-shrink-0 lg:pb-8 lg:px-6 lg:items-start items-center flex flex-col pb-8 gap-1">
                            <SidebarButton
                                isIconOnly={isIconOnly}
                                label={isIconOnly ? "Info." : "Más información"}
                                startContent={<InfoSparkleFilled className="size-5"/>}
                                onPress={() => {alert("info");}}
                            /> 
                            <SidebarButton
                                isDanger={true}
                                isIconOnly={isIconOnly}
                                label="Cerrar sesión"
                                startContent={<PersonArrowLeftFilled className="size-5"/>}
                                onPress={() => setIsOpen(true)}
                            /> 
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col bg-transparent gap-4">
                        {/* CONTENIDO */}
                        <div className="flex-1 py-4 pl-4 transition-colors duration-1000 ease-in-out bg-background rounded-lg overflow-hidden
                        shadow-[80px_40px_100px_10px_rgba(0,0,0,0.1)] 
                        dark:shadow-[80px_40px_100px_20px_rgba(255,255,255,0.05)]">
                            <ScrollShadow className="h-full bg-transparent pr-8 py-4 pl-4
                            [&::-webkit-scrollbar]:xs:w-2
                            [&::-webkit-scrollbar]:w-1
                            [&::-webkit-scrollbar-track]:rounded-full
                            [&::-webkit-scrollbar-track]:bg-transparent
                            [&::-webkit-scrollbar-thumb]:rounded-full
                            [&::-webkit-scrollbar-thumb]:bg-background-300">
                                <div className="w-full flex flex-col">
                                    {children}
                                </div>
                            </ScrollShadow>
                        </div>

                        {/* BOTTOM NAVIGATION */}
                        <div className="flex-shrink-0 flex justify-center h-[72px] bg-transparent sm:hidden rounded-lg z-50
                        shadow-[0px_0px_100px_10px_rgba(0,0,0,0.1)]
                        dark:shadow-[0px_0px_100px_20px_rgba(255,255,255,0.05)]">
                            {navigation.map(({ label, icon, path }) => (
                                <BottomButton
                                    isActive={getIsActive(path)}
                                    key={label}
                                    label={label}
                                    centerContent={icon}
                                    onPress={() => {navigate(path);}}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <LogOutModal isOpen={isOpen} onOpenChange={setIsOpen}/>
        </>
    )
}

export const LogOutModal = ({isOpen, onOpenChange}) => {
    const {onClose} = useDisclosure();
    const targetRef = useRef(null);
    const {moveProps} = useDraggable({targetRef, isDisabled: !isOpen});
    let navigate = useNavigate()

    return (
        <>
            <Modal 
                isOpen={isOpen} 
                onClose={onClose} 
                onOpenChange={onOpenChange}
                ref={targetRef} 
                hideCloseButton
                className="bg-background"
                size="md"
                backdrop="opaque"
                classNames={{
                    backdrop: "bg-gradient-to-b from-secondary/20 to-primary/20 dark:bg-gradient-to-b from-secondary/10 to-primary/10",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader {...moveProps} className="flex flex-col gap-2">
                            <div className="w-full flex justify-end">
                                <CloseButton onPress={onClose}/>     
                            </div>
                            <p className="text-lg font-bold text-center">¿Desea cerrar la sesión actual?</p>
                        </ModalHeader>
                        <ModalBody>
                            <p className="text-center">Está a punto de cerrar sesión, sin embargo, puede ingresar de nuevo sin problema.</p>
                        </ModalBody>
                        <ModalFooter className="flex justify-center py-6">
                            <Button 
                                className="!text-current"
                                variant="light"
                                radius="sm"
                                onPress={onClose}
                                startContent={<Dismiss12Filled className="size-5 !text-current"/>}>
                                Cancelar
                            </Button>

                            <Button
                                className="font-medium tracking-wide data-[hover=true]:-translate-y-1"
                                color="danger"
                                radius="sm"
                                variant="shadow"
                                onPress={() => navigate("/Login")}
                                startContent={<PersonArrowLeftFilled className="size-5"/>}
                            >    
                                Cerrar sesión
                            </Button>
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}