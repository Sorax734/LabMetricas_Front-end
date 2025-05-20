import { useTheme } from "@heroui/use-theme";
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import { LightButton } from "./LightButton";

export const ThemeSwitcher = ({
    isIconOnly = false,     // ¿El botón es un ícono? Si sí, ignorará el texto del botón, sino lo mostrará
}) => {

    const { theme, setTheme } = useTheme()

    const className = "transition-transform duration-1000 group-data-[hover=true]:rotate-[360deg]"

    const label = theme === "light" ? "Tema claro" : "Tema oscuro"

    return (
        <>
            <LightButton
                isIconOnly={isIconOnly}
                label={label}
                onPress={() => theme === 'light' ? setTheme('dark') : setTheme('light')}
                startContent={
                    theme === 'light' ? (
                        <SunIcon className={'size-6 ' + className} />
                    ) : (
                        <MoonIcon className={'size-5 ' + className} />
                    )
                }
            />
        </>
    )
};