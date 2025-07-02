import { PersonAvailableFilled, PersonSubtractFilled } from "@fluentui/react-icons";
import { ChangeStatusModal } from "../ChangeStatusModal"
import { PrimaryButton } from "../PrimaryButton";

export const UsersChangeStatusModal = ({isOpen, onOpenChange, data}) => {
    if (data){
        return (
            <ChangeStatusModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={`¿Desea ${data.status === "activo" ? "inhabilitar" : "habilitar"} al usuario: ${data.name}?`}
                description={data.status === "activo" ? "Al inhabilitar el usuario, se restringirá su acceso a la aplicación de forma temporal, pero podrá ser habilitado nuevamente en cualquier momento." : "Al habilitar el usuario, se restablecerá su acceso a la aplicación con normalidad."}
            >
                <PrimaryButton
                    label={data.status === "activo" ? "Inhabilitar" : "Habilitar"}
                    startContent={data.status === "activo" ? <PersonSubtractFilled className="size-5"/> : <PersonAvailableFilled className="size-5"/>}
                />
            </ChangeStatusModal>
        )
    }
}
