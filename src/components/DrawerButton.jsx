import { motion } from 'framer-motion'
import { LightButton } from './LightButton';

export const DrawerButton = ({
    isActive = false,       // (Usar solamente en sidebar) ¿El botón está activo? Si sí, será color azul, sino será foreground (blanco / negro)
    label = "null",         // Texto del botón y del tooltip
    startContent,           // Ícono
    onPress,                // Función a ejecutar cuando se presione el botón
}) => {

    return (
        <>
            <div className="flex items-center">
                {/* Indicador animado */}
                {isActive && (
                    <motion.span
                    layoutId="drawer-layout"
                    className="absolute transform w-1 h-6 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 900, damping: 60 }}
                    />
                )}
                <LightButton
                    isActive={isActive}
                    label={label}
                    startContent={startContent}
                    onPress={onPress}
                />
            </div>
        </>
    );
}