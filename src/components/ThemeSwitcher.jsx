import { useState, useEffect } from "react";
import { useTheme } from "@heroui/use-theme";
import { Switch } from "@heroui/react";
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'

export const ThemeSwitcher = ({ isIconOnly = false }) => {
    const { theme, setTheme } = useTheme();
    const [isSelected, setIsSelected] = useState(theme === "dark");
    const label = `Tema ${isSelected ? 'oscuro' : 'claro'}`

    useEffect(() => {
        setTheme(isSelected ? "dark" : "light");
    }, [isSelected, setTheme]);

    return (
        <Switch
            color="default"
            size="lg"
            isSelected={isSelected}
            onValueChange={setIsSelected} 
            classNames={{ label: "font-medium text-sm", wrapper: "bg-background-100 group-data-[selected=true]:bg-background-100", thumb: "bg-background" }}
            thumbIcon={({isSelected}) =>
                isSelected ? <MoonIcon className="size-5 text-current" /> : <SunIcon className="size-6 text-current" />
            }
        >
            {!isIconOnly ? label : ''}
        </Switch>
    );
};
