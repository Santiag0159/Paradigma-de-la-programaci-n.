import { validarEntrada, validarFecha, validarinfoTarea, estadosValidos, dificultadesValidas } from './validaciones.js'
import { readFile, writeFile } from 'fs/promises'
import path from 'path';

const FILE_NAME = 'tasks.json';
const filePath = path.join(process.cwd(), FILE_NAME);
let tareas = [];

export async function cargarTareas() {
    console.log(`\nCargando tareas desde ${FILE_NAME}...`);
    try {
        const data = await readFile(filePath, 'utf8');
        let tareasDelArchivo = JSON.parse(data);
        if (!Array.isArray(tareasDelArchivo)) {
            console.error("ERROR: El archivo no corresponde a una lista valida. Inicializando con lista vacia...");
            tareasDelArchivo = [];
        }
        let cargadas = 0;
        let errores = 0;
        tareas = []; 
        for (const tarea of tareasDelArchivo) {
            const tareaValidada = validarinfoTarea(tarea);
            if (tareaValidada) {
                tareas.push(tareaValidada);
                cargadas++;
            } else {
                errores++;
            }
        }
        
        console.log(`Carga exitosa: ${cargadas} tareas cargadas. (${errores} tareas con errores de formato descartadas)`);

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`Archivo ${FILE_NAME} no encontrado. Creando una lista de tareas vacia...`);
            tareas = [];
            await guardarTareas(); 
        } else if (error instanceof SyntaxError) {
            console.error(`Error de formato JSON en ${FILE_NAME}. No se pudo parsear el archivo. Inicializando lista vacia...`, error.message);
            tareas = []; 
        } else {
            console.error("Ocurrio un error inesperado durante la carga de tareas:", error.message);
            tareas = []; 
        }
    }
}
export async function guardarTareas() {
    try {
        console.log(`\nGuardando ${tareas.length} tareas en ${FILE_NAME}...`);        
        const jsonContent = JSON.stringify(tareas, null, 4);
        
        await writeFile(filePath, jsonContent, 'utf8');
        console.log("Tareas guardadas exitosamente.");
    } catch (error) {
        console.error("Error al escribir el archivo de tareas:", error.message);
    }
}
export async function agregarTarea() {
    console.log("\nAgregar Nueva Tarea");
    const titulo = validarEntrada("Ingrese el titulo de la tarea: ");
    let descripcion = validarEntrada("Ingrese la descripcion: ").trim();
    if (descripcion === '') descripcion = null; 


    let estado = '';
    while (!estadosValidos.includes(estado)) {
        estado = validarEntrada(`Ingrese el estado (${estadosValidos.join('/')}): `);
        if (!estadosValidos.includes(estado)) {
            console.log(`Estado no valido. Ingrese uno de: ${estadosValidos.join(', ')}`);
        }
    }

    const vencimientoStr = validarEntrada("Ingrese la fecha de vencimiento (dd-mm-yyyy): ").trim();
    let vencimientoDate = null;
    if (vencimientoStr !== '') {
        const fechaVenc = validarFecha(`Re-ingrese fecha de vencimiento valida (dd-mm-yyyy): `);
        vencimientoDate = fechaVenc.toISOString(); 
    }


    let dificultadNum = null;

    let dificultadStr = validarEntrada(`Ingrese la dificultad (${dificultadesValidas.join('/')}): `).trim();

    if (dificultadStr !== '') {
        const num = Number(dificultadStr);
        if (dificultadesValidas.includes(num)) {
            dificultadNum = num;
        } else {
            console.log("La Dificultad no es valida, se establecera en null.");
        }
    }

    const ahora = new Date().toISOString();


    const nuevaTarea = validarinfoTarea({
        titulo: titulo,
        descripcion: descripcion,
        estado: estado,
        creacion: ahora, 
        ultimaEdicion: ahora, 
        vencimiento: vencimientoDate,
        dificultad: dificultadNum
    });

    if (nuevaTarea) {
        tareas.push(nuevaTarea);
        console.log("La tarea ha sido agregada");
    } else {
        console.log("Error: La tarea generada no fue agregada.");
    }
}
export async function mostrarTareas() {
    if (tareas.length === 0) { 
        console.log("\nNo hay tareas disponibles para mostrar");
        return;
    }

    console.log("\nLista de Tareas");
    tareas.forEach((tarea, index) => {
        const creacion = new Date(tarea.creacion).toLocaleDateString();
        const ultimaEdicion = tarea.ultimaEdicion ? new Date(tarea.ultimaEdicion).toLocaleDateString() : 'Sin Fecha';
        const vencimiento = tarea.vencimiento ? new Date(tarea.vencimiento).toLocaleDateString() : 'Sin Fecha';
        const descripcion = tarea.descripcion || 'Sin descripcion'; 

        console.log(`
        ID: ${index + 1}
        Titulo: ${tarea.titulo}
        Descripcion: ${descripcion}
        Estado: ${tarea.estado}
        Creacion: ${creacion}
        Ultima Edicion: ${ultimaEdicion}
        Vencimiento: ${vencimiento}
        Dificultad: ${tarea.dificultad || 'Sin Fecha'}
        `);
    });
}
export async function buscarTarea() {
    const tituloBuscado = validarEntrada("\nIngrese el titulo de la tarea a buscar: ");
    
    const tareaEncontrada = tareas.find(tarea => 
        tarea.titulo.toLowerCase().includes(tituloBuscado.toLowerCase())
    );

    if (tareaEncontrada) {
        console.log("Su tarea es");
        
        const creacion = new Date(tareaEncontrada.creacion).toLocaleDateString();
        const ultimaEdicion = tareaEncontrada.ultimaEdicion ? new Date(tareaEncontrada.ultimaEdicion).toLocaleDateString() : 'Sin Fecha';
        const vencimiento = tareaEncontrada.vencimiento ? new Date(tareaEncontrada.vencimiento).toLocaleDateString() : 'Sin Fecha';
        const descripcion = tareaEncontrada.descripcion || 'Sin descripcion';
        
        console.log(`
        Titulo: ${tareaEncontrada.titulo}
        Descripcion: ${descripcion}
        Estado: ${tareaEncontrada.estado}
        Creacion: ${creacion}
        Ultima Edicion: ${ultimaEdicion}
        Vencimiento: ${vencimiento}
        Dificultad: ${tareaEncontrada.dificultad || 'Sin Fecha'}
        `);
    } else {
        console.log("No existen tareas con ese titulo");
    }
}
export async function editarTarea() {
    const tituloBuscado = validarEntrada("\nIngrese el titulo de la tarea a modificar: ");
    const indiceEncontrado = tareas.findIndex(tarea => tarea.titulo.toLowerCase() === tituloBuscado.toLowerCase());

    if (indiceEncontrado === -1) {
        console.log("No existen tareas con ese titulo ");
        return;
    }

    let tarea = tareas[indiceEncontrado];
    console.log(`\nModificando: ${tarea.titulo}`);
    console.log("1. Titulo");
    console.log("2. Descripcion");
    console.log("3. Estado");
    console.log("4. Vencimiento");
    console.log("5. Dificultad");
    console.log("6. Cancelar");

    const opcion = validarEntrada("Seleccione una opcion ");
    let valorNuevo;

    switch (opcion) {
        case "1":
            valorNuevo = validarEntrada("Ingrese el nuevo titulo: ");
            tarea.titulo = valorNuevo;
            break;
        case "2":
            valorNuevo = validarEntrada("Ingrese la nueva descripcion: ");
            tarea.descripcion = valorNuevo.trim() === '' ? null : valorNuevo;
            break;
        case "3":
            while (true) {
                valorNuevo = validarEntrada(`Ingrese el nuevo estado (${estadosValidos.join('/')}): `);
                if (estadosValidos.includes(valorNuevo)) {
                    tarea.estado = valorNuevo;
                    break;
                }
                console.log(`Estado no valido. Ingrese uno de: ${estadosValidos.join(', ')}`);
            }
            break;
        case "4":
            valorNuevo = validarEntrada("Ingrese la nueva fecha de vencimiento (dd-mm-yyyy) o deje vacio: ").trim();
            if (valorNuevo === '') {
                tarea.vencimiento = null; 
            } else {
                const fechaVenc = validarFecha(`Re-ingrese fecha de vencimiento valida (dd-mm-yyyy): `);
                tarea.vencimiento = fechaVenc.toISOString(); 
            }
            break;
        case "5":
            valorNuevo = validarEntrada(`Ingrese la nueva dificultad (${dificultadesValidas.join('/')}) o deje vacio: `).trim();
            if (valorNuevo === '') {
                tarea.dificultad = null; 
            } else {
                const num = Number(valorNuevo);
                if (dificultadesValidas.includes(num)) {
                    tarea.dificultad = num;
                } else {
                    console.log("Dificultad no valida. No se guardaran los cambios...");
                    return;
                }
            }
            break;
        case "6":
            console.log("Modificacion cancelada");
            return;
        default:
            console.log("Ingrese una opcion valida...");
            return;
    }

    tarea.ultimaEdicion = new Date().toISOString();

    tareas[indiceEncontrado] = tarea;
    console.log("La tarea se modifico");
}
export async function eliminarTarea() {
    const tituloBuscado = validarEntrada("\nIngrese el titulo de la tarea a eliminar: ");
    
    const indiceEncontrado = tareas.findIndex(tarea => tarea.titulo.toLowerCase() === tituloBuscado.toLowerCase());

    if (indiceEncontrado !== -1) {
        const tituloEliminado = tareas[indiceEncontrado].titulo;
        tareas.splice(indiceEncontrado, 1);
        console.log(`Tarea '${tituloEliminado}' eliminada`);
    } else {
        console.log("Tarea no encontrada");
    }
}