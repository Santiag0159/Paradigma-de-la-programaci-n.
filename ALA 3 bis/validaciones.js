import readline from 'readline-sync';

const estadosValidos = ["PENDING", "IN-PROGRESS", "FINISHED", "CANCELED"];
const dificultadesValidas = [1, 2, 3];

function validarEntrada(pregunta) {
    let entrada = '';
    while (entrada.trim() === '') {
        entrada = readline.question(pregunta);
        if (entrada.trim() === '') {
            console.log("Ingrese un valor valido...");
        }
    }
    return entrada.trim(); 
}

function validarFecha(pregunta) {
    let entradaFecha = '';
    let fechaEsValida = false;
    let fecha;
    while (!fechaEsValida) {
        entradaFecha = validarEntrada(pregunta);
        const partes = entradaFecha.split('-');
        
        if (partes.length !== 3) {
            console.log("Ingrese la fecha en el formato dd-mm-yyyy");
            continue;
        }
        const dia = Number(partes[0]);
        const mes = Number(partes[1]);
        const anio = Number(partes[2]);
        if (isNaN(dia) || isNaN(mes) || isNaN(anio) || partes[0].length !== 2 || partes[1].length !== 2 || partes[2].length !== 4) {
            console.log("Formato invalido. Ingrese la fecha en el formato dd-mm-yyyy");
            continue;
        }
        fecha = new Date(anio, mes - 1, dia);
        if (fecha.getFullYear() !== anio || fecha.getMonth() !== (mes - 1) || fecha.getDate() !== dia) {
            console.log("Ingrese una fecha valida... ejemplo (16-02-2026");
            continue;
        }
        fechaEsValida = true;
    }
    return fecha; 
}


function validarinfoTarea(tarea) {
    const errores = [];

    if (!tarea.titulo || typeof tarea.titulo !== 'string' || tarea.titulo.trim() === '') {
        errores.push("Es obligatorio que tenga titulo la tarea.");
    }

    if (!tarea.estado || !estadosValidos.includes(tarea.estado)) {
        errores.push(`El estado es obligatorio y debe ser uno de: ${estadosValidos.join(', ')}.`);
    }

    if (!tarea.creacion || isNaN(new Date(tarea.creacion).getTime())) {
        errores.push("La fecha de creacion debe ser valida");
    }

    if (tarea.dificultad !== undefined && tarea.dificultad !== null) {
        if (!dificultadesValidas.includes(tarea.dificultad)) {
            errores.push(`La dificultad debe poseer un valor valido`);
        }
    }
    
    if (tarea.descripcion !== undefined && tarea.descripcion !== null && typeof tarea.descripcion !== 'string') {
        errores.push("La descripcion debe poseer un valor valido");
    }
    

    if (tarea.vencimiento !== undefined && tarea.vencimiento !== null && isNaN(new Date(tarea.vencimiento).getTime())) {
        errores.push("La fecha de vencimiento debe ser valida");
    }


    if (tarea.ultimaEdicion !== undefined && tarea.ultimaEdicion !== null && isNaN(new Date(tarea.ultimaEdicion).getTime())) {
        errores.push("La fecha de edicion debe ser valida");
    }


    if (errores.length > 0) {
        console.error(`Errores de validacion para una tarea:\n- ${errores.join('\n- ')}`);
        return null; 
    }

    const tareaNormalizada = {
        titulo: tarea.titulo,
        descripcion: tarea.descripcion || null,
        estado: tarea.estado,
        creacion: tarea.creacion,
        ultimaEdicion: tarea.ultimaEdicion || null,
        vencimiento: tarea.vencimiento || null,
        dificultad: tarea.dificultad || null
    };
    return tareaNormalizada;
}
export { validarEntrada, validarFecha, validarinfoTarea, estadosValidos, dificultadesValidas };