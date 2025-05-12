import { useTheme } from "@heroui/use-theme";
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import { TextButton } from "./TextButton";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme()
    const label = theme === "light" ? "Tema claro" : "Tema oscuro"

    return (
        <>
            <TextButton
                isSubmit={false} // ¿El botón se ocupa en un form?
                isIconOnly={true} // ¿El botón es un ícono? Si sí, ignorará el texto del botón, sino lo mostrará
                isActive={false} // ¿El botón está activo? Si sí, será color azul, sino será foreground (blanco / negro)
                label={label} // Texto del botón
                tooltipLabel={label}  // Texto del tooltip
                tooltipPlacement="right"
                onPress={() => theme === 'light' ? setTheme('dark') : setTheme('light')}
                startContent={
                    theme === 'light' ? (
                        <SunIcon className='size-6 transition-transform duration-1000 group-data-[hover=true]:rotate-[360deg]' />
                    ) : (
                        <MoonIcon className='size-5 transition-transform duration-1000 group-data-[hover=true]:rotate-[360deg]' />
                    )
                }
            />
        </>
    )
};