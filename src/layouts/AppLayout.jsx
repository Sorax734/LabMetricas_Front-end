import { AlertFilled, BuildingPeopleFilled, ClockBillFilled, DatabaseSearchFilled, DataLineFilled, Dismiss12Filled, DismissCircleFilled, DismissFilled, DockFilled, DocumentBulletListClockFilled, DocumentMultipleFilled, DocumentTextClockFilled, DoorArrowLeftFilled, EmojiHandFilled, InfoFilled, InfoSparkleFilled, KeyMultipleFilled, KeyResetFilled, PeopleFilled, PeopleListFilled, PeopleSettingsFilled, PeopleStarFilled, PeopleToolboxFilled, PersonArrowLeftFilled, PersonBriefcaseFilled, PersonFilled, PersonHeartFilled, PersonSearchFilled, PersonSettingsFilled, PersonSquareFilled, PersonWrenchFilled, ScriptFilled, SearchFilled, SearchSparkleFilled, SettingsCogMultipleFilled, SettingsFilled, WeatherMoonFilled, WeatherSunnyFilled, WrenchSettingsFilled } from "@fluentui/react-icons"
import { ClockIcon, HomeIcon, MoonIcon, SunIcon } from "@heroicons/react/24/solid"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useIsIconOnly } from "../hooks/useIsIconOnly"
import { addToast, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow, Spinner, useDisclosure, useDraggable, User } from "@heroui/react"
import { SidebarButton } from "../components/SidebarButton"
import { BottomButton } from "../components/BottomButton"
import { useTheme } from "@heroui/use-theme"
import { useEffect, useRef, useState } from "react"
import { CloseButton } from "../components/CloseButton"
import { PrimaryButton } from "../components/PrimaryButton"
import { useAuth } from "../hooks/useAuth"
import { getProfile } from "../service/user"
import { motion } from "framer-motion"

const home = {
    label: "Inicio",
    icon: <HomeIcon className='sm:size-5 size-6' />,
    path: "/App"
}

const adminNavigation = [
    home,
    {
        label: "Usuarios",
        icon: <PeopleFilled className='sm:size-5 size-6' />,
        path: "/App/Users"
    },
    {
        label: "Clientes",
        icon: <PeopleToolboxFilled className='sm:size-5 size-6' />,
        path: "/App/Customers"
    },
    {
        label: "Equipos",
        icon: <SettingsCogMultipleFilled className='sm:size-5 size-6' />,
        path: "/App/Equipments"
    },
    {
        label: "Registro de auditoría",
        icon: <ScriptFilled className='sm:size-5 size-6' />,
        path: "/App/Logs"
    }
]

const operadorNavigation = [
    home,
    {
        label: "Historial",
        icon: <ClockIcon className='size-5' />,
        path: "/App/History"
    }
]

const supervisorNavigation = [
    home,
    {
        label: "Documentos",
        icon: <DocumentMultipleFilled className='size-5' />,
        path: "/App/Documents"
    }
]

export const UserProfile = ({user}) => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const tema = `Tema ${theme === 'dark' ? 'oscuro' : 'claro'}`

    let navigate = useNavigate()

    let navigation

    switch (user.role){
        case 1: navigation = adminNavigation; break;
        case 2: navigation = supervisorNavigation; break;
        case 3: navigation = operadorNavigation; break;

        default: navigation = []
    }

    return (
        <>
            <Dropdown placement="bottom" className="bg-background-100 w-44 transition-colors duration-1000 ease-in-out"
                shadow="lg" radius="sm">
                <DropdownTrigger>
                    <User   
                        as="button"
                        avatarProps={{
                            size: "md",
                            radius: "sm",
                            name: user.name.split(' ').map(word => word[0]).join('').toUpperCase(),
                            className: "bg-background-100 transition-colors duration-1000 ease-in-out",
                            classNames: {name: "text-sm font-medium"}
                        }}
                        classNames={{name: "text-base font-medium hidden lg:flex", description: "text-xs text-background-500 hidden lg:flex"}}
                        className="transition-transform gap-0 lg:gap-2"
                        description={user.email}
                        name={user.name}
                    />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="light" itemClasses={{base:"mt-1 mb-2"}} >
                    <DropdownSection title="Opciones" classNames={{ heading: "text-background-500 font-normal"}}>
                        <DropdownItem 
                            className="rounded-md transition-all !duration-1000 ease-in-out "
                            key="profile"
                            startContent={<PersonFilled className="size-5"/>}
                            onPress={() => navigate("/App/Profile")}
                        >
                            Mi perfil
                        </DropdownItem>

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
                            startContent={<KeyMultipleFilled className="size-5"/>}
                            //onPress={() => navigate("/App/Profile")}
                        >
                            Cambiar contraseña
                        </DropdownItem>

                        <DropdownItem
                            className="rounded-md transition-all !duration-1000 ease-in-out "
                            key="theme"
                            startContent={theme === 'dark' ? <WeatherMoonFilled className="size-5 text-current" /> : <WeatherSunnyFilled className="size-5 text-current" />}
                            onPress={() => {theme === 'dark' ? setTheme('light') : setTheme('dark') }}
                        >
                            {tema}
                        </DropdownItem>

                        <DropdownItem 
                            className="rounded-md transition-all !duration-1000 ease-in-out -mb-1"
                            key="logout"
                            color="primary"
                            startContent={<DoorArrowLeftFilled className="size-5"/>}
                            onPress={() => setIsOpen(true)}
                        >
                            Cerrar sesión
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
            <LogOutModal isOpen={isOpen} onOpenChange={setIsOpen}/>
        </>
    );
}

export const AppLayout = () => {
    let navigate = useNavigate()
    const {user} = useAuth()
    const isIconOnly = useIsIconOnly()
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const [isLoading, setIsLoading] = useState(true)

    const [profile, setProfile] = useState({})
    const [errors, setErrors] = useState([])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true)
                
                const response = await getProfile()
                const data = response.data
            
                if (data) {
                    setProfile(data)
                    setIsLoading(false)
                } else {
                    addToast({
                        title: "No se pudo obtener el perfil",
                        description: "Ocurrió un error al obtener el perfil",
                        color: "danger",
                        icon: <DismissCircleFilled className='size-5' />
                    })
                    setErrors(prev => [...prev, "No se pudo obtener el perfil"])
                    setIsLoading(false)
                }
            } catch (err) {
                setErrors(prev => [...prev, err.message])
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [user])

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
            {isLoading ? (
                <div className="flex w-screen h-screen justify-center items-center">
                    <Spinner
                        classNames={{ label: "pt-2 text-sm font-medium" }}
                        color="current"
                        size="md"
                        label="Espere un poco por favor"
                    />
                </div>
                ) : ( errors.length > 0 ? (
                    <div className="flex flex-col w-screen h-screen lg:p-28 md:p-24 sm:p-20 p-10 space-y-4 overflow-x-hidden overflow-y-auto">
                        <p className="text-2xl font-bold pb-2">Vaya...</p>
                        <p className="text-xl font-medium pb-8">Algo ha ido mal al iniciar la aplicación</p>
                        {errors.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                        >
                            <div key={i} className="bg-danger-50 rounded-lg border-danger-100 border py-4 px-3 flex gap-3">
                                <div className="flex items-center justify-center text-danger-600">
                                    <DismissCircleFilled className="size-5" />
                                </div>
                                <div className="text-sm text-danger-600">
                                    <p className="font-medium break-words">{msg}</p>
                                </div>
                            </div>
                        </motion.div>
                        ))}
                    </div>
                ) : ( 
                    <>
                        {/* PANTALLA */}
                        <div className="flex flex-col w-screen h-dvh bg-background transition-colors duration-1000 ease-in-out sm:p-4 sm:gap-4 overflow-hidden">
                            {/* NAVBAR */}
                            <div className="flex-shrink-0 h-[72px] bg-background rounded-lg transition-colors duration-1000 ease-in-out flex sm:z-auto z-50
                            sm:shadow-[0px_0px_100px_10px_rgba(0,0,0,0.1)]
                            sm:dark:shadow-[0px_0px_100px_20px_rgba(255,255,255,0.05)]">
                                <div className="px-4 justify-center w-96 hidden sm:flex flex-col">
                                    <p className="text-base font-medium">Nombre del sistema</p>
                                    <p className="text-xs text-background-500">Lab Métricas SAS de CV.</p>
                                </div>

                                <div className="px-4 flex w-full justify-end items-center sm:gap-4 gap-2">
                                    <Input
                                        classNames={{ input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal", mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                        className="grow sm:max-w-72"
                                        color="primary"
                                        name="search"
                                        labelPlacement="inside"
                                        type="text"
                                        radius="sm"
                                        size="md"
                                        variant="bordered"
                                        maxLength={100}
                                        value={searchValue}
                                        onValueChange={(val) => {
                                            setSearchValue(val)
                                        }}
                                        isClearable
                                        placeholder={location.pathname === "/App/Maintenance-Calibration" ? "Buscar resultados por código" : "Buscar resultados por nombre"}
                                        endContent={<div className="w-full h-full flex items-center justify-center"><DismissFilled className='size-5 group-data-[focus=true]:text-primary' /></div>}
                                    />
                                    <UserProfile user={profile}/>
                                </div>
                            </div>

                            <div className="flex flex-1 min-h-0 bg-transparent gap-4">
                                {/* SIDEBAR */}
                                <div className="flex-shrink-0 flex-col lg:w-52 w-28 hidden sm:flex h-full transition-colors duration-1000 ease-in-out bg-background rounded-lg overflow-y-auto overflow-x-hidden
                                [&::-webkit-scrollbar]:lg:w-2
                                [&::-webkit-scrollbar]:w-1
                                [&::-webkit-scrollbar-track]:rounded-full
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-background-300
                                shadow-[0px_40px_100px_10px_rgba(0,0,0,0.1)] 
                                dark:shadow-[0px_40px_100px_20px_rgba(255,255,255,0.05)]">
                                    <div className="flex-shrink-0 lg:px-4 w-full lg:items-start items-center flex flex-col pt-4 gap-1">
                                        <p className="text-base hidden lg:flex font-medium">Bienvenido de vuelta {profile.roleName === "ADMIN" ? "administrador" : profile.roleName.toLowerCase()}</p>

                                        <p className="text-xs text-background-500 hidden lg:flex pt-6">Páginas</p>
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

                                        <p className="text-xs text-background-500 hidden lg:flex pt-6">Módulos</p>
                                        <div className="hidden sm:flex lg:hidden px-2 w-full justify-center py-1">
                                            <div className="h-[1px] rounded-full w-20 bg-background-300"/>
                                        </div>
                                        <SidebarButton
                                            isActive={getIsActive("/App/Maintenance-Calibration")}
                                            isIconOnly={isIconOnly}
                                            label="Mantenimiento y calibración"
                                            startContent={<div className="size-5 flex items-center justify-center"><WrenchSettingsFilled className='size-5' /></div>}
                                            onPress={() => {navigate("/App/Maintenance-Calibration");}}
                                        />
                                    </div>
                                    <ScrollShadow className="flex-1 lg:pt-6 lg:pl-6
                                    [&::-webkit-scrollbar]:lg:w-2
                                    [&::-webkit-scrollbar]:w-1
                                    [&::-webkit-scrollbar-track]:rounded-full
                                    [&::-webkit-scrollbar-track]:bg-transparent
                                    [&::-webkit-scrollbar-thumb]:rounded-full
                                    [&::-webkit-scrollbar-thumb]:bg-background-300">
                                        <div className="w-full h-full lg:pr-6 lg:justify-normal justify-center flex">
                                            {/**<p className="text-xs text-background-500 hidden lg:flex">Documentos</p> header */}
                                            {/**Aqui se colocaran los documentos del usuario */}
                                        </div>
                                    </ScrollShadow>
                                    <div className="flex-shrink-0 pb-4 lg:px-4 lg:items-start items-center flex flex-col gap-1">
                                        
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col bg-transparent sm:gap-4 min-w-0">
                                    {/* CONTENIDO */}
                                    <div className="flex-1 transition-colors duration-1000 ease-in-out bg-background rounded-lg overflow-y-hidden
                                    sm:shadow-[80px_40px_100px_10px_rgba(0,0,0,0.1)] 
                                    dark:sm:shadow-[80px_40px_100px_20px_rgba(255,255,255,0.05)]">
                                        <ScrollShadow className="h-full bg-transparent pl-4 pt-2 sm:py-6 xs:pl-6
                                        [&::-webkit-scrollbar]:h-1
                                        [&::-webkit-scrollbar]:w-1
                                        [&::-webkit-scrollbar-track]:rounded-full
                                        [&::-webkit-scrollbar-track]:bg-transparent
                                        [&::-webkit-scrollbar-thumb]:rounded-full
                                        [&::-webkit-scrollbar-thumb]:bg-primary">
                                            <div className="w-full h-full flex flex-col pr-4 xs:pr-6">
                                                <Outlet context={{ searchValue, setSearchValue, userName: profile.name }} />
                                            </div>
                                        </ScrollShadow>
                                    </div>

                                    {/* BOTTOM NAVIGATION */}
                                    <div className="flex-shrink-0 flex justify-center h-16 bg-transparent sm:hidden rounded-lg z-50 gap-2
                                    shadow-[0px_0px_100px_10px_rgba(0,0,0,0.1)]
                                    dark:shadow-[0px_0px_100px_20px_rgba(255,255,255,0.05)]">
                                        {navigation.map(({ label, icon, path }) => (
                                            <BottomButton
                                                isActive={getIsActive(path)}
                                                key={label}
                                                centerContent={icon}
                                                onPress={() => {navigate(path);}}
                                            />
                                        ))}
                                        <BottomButton
                                            isActive={getIsActive("/App/Maintenance-Calibration")}
                                            centerContent={<div className="size-6 flex items-center justify-center"><WrenchSettingsFilled className='sm:size-5 size-6' /></div>}
                                            onPress={() => {navigate("/App/Maintenance-Calibration");}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ))
            }
            <LogOutModal isOpen={isOpen} onOpenChange={setIsOpen}/>
        </>
    )
}

export const LogOutModal = ({isOpen, onOpenChange}) => {
    const {onClose} = useDisclosure();
    const targetRef = useRef(null);
    const {moveProps} = useDraggable({targetRef, isDisabled: !isOpen});
    let navigate = useNavigate()
    
    const {logout} = useAuth()

    const handleLogout = async () => {
        await logout();
        navigate("/Login");
    };

    return (
        <>
            <Modal 
                classNames={{wrapper: "overflow-hidden"}}
                isOpen={isOpen} 
                onClose={onClose} 
                onOpenChange={onOpenChange}
                ref={targetRef} 
                hideCloseButton
                className="bg-background"
                size="md"
                backdrop="blur"
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
                                className="bg-transparent"
                                radius="sm"
                                startContent={<DismissFilled className="size-5"/>}
                                onPress={onClose}
                            >
                                Cancelar
                            </Button>

                            <PrimaryButton
                                label="Cerrar sesión"
                                startContent={<DoorArrowLeftFilled className="size-5"/>}
                                onPress={handleLogout}
                            />
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}