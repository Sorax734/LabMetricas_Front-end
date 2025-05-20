import { 
    useDisclosure,
} from "@heroui/react";

import { AppBottomNavigation, AppDrawerNavigation, AppSidebarNavigation } from './Navigation';

export const AppLayout = ({ 
    children,
    role,
    name,
    email
}) => {

const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

    return (
        <>
            {/* SIDEBAR Y CONTENIDO PRINCIPAL */}
            <div className="flex w-screen h-screen">
                <AppSidebarNavigation
                    role={role}
                    name={name}
                    email={email}
                    onOpen={onOpen}
                />

                {/* CONTENIDO PRINCIPAL */}
                <div className='flex-1 flex flex-col'>

                    { /* BODY */ }
                    <div className='flex-1 overflow-y-auto [scrollbar-color:#808080_transparent]'>
                        <div className='m-8 sm:mx-12 transition-all ease-in-out duration-500'>
                            {children}
                        </div>
                    </div>

                    {/* Bottom Navigation <SM */}
                    <AppBottomNavigation role={role} />
                </div>
            </div>

            <AppDrawerNavigation 
                role={role}
                name={name}
                email={email}
                isOpen={isOpen}
                onOpenChange={onOpenChange} 
                onClose={onClose} 
            />
        </>
    )
}