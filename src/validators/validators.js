export function required(value) {
    if (value === null || value.trim().length === 0){
        return "El campo es obligatorio."
    }
}

export function onlyLetters(value) {
    if (value !== null && !value.match(/^\p{L}+(?:\s\p{L}+)*$/u)){
        return "No se permiten números, símbolos, ni espacios al inicio o final."
    }
}

export function validPhone(value) {
    if (value === null || value === "") {
        return;
    }

    if (!/^[0-9]{10}$/.test(value)) {
        return "Ingresa un número de teléfono valido.";
    }
}

export function validRoleId(value) {
    if (value !== null && !/^[0-9]+$/.test(value)) {
        return "Selecciona una opción válida.";
    }
}

export function validEmail(value) {
    if (value !== null && !value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)){
        return "Ingresa una dirección de correo electrónico valida."
    }
}
