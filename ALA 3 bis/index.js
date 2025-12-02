import { validarEntrada } from './validaciones.js'
import { cargarTareas, guardarTareas, agregarTarea, mostrarTareas, buscarTarea, editarTarea, eliminarTarea} from './tareas.js'

async function main() {
    await cargarTareas();
    let continuar = true;
    while (continuar) {
        console.log("\nGestor de Tareas");
        console.log("1. Agregar tarea");
        console.log("2. Mostrar tareas");
        console.log("3. Buscar tarea por titulo");
        console.log("4. Editar tarea");
        console.log("5. Eliminar tarea");
        console.log("6. Salir y guardar");
        console.log("0. Salir");
        const opcion = validarEntrada("Seleccione una opcion: "); 
        try {
            switch (opcion) {
                case "1":
                    await agregarTarea(); 
                    break;
                case "2":
                    await mostrarTareas();
                    break;
                case "3":
                    await buscarTarea();
                    break;
                case "4":
                    await editarTarea();
                    break;
                case "5":
                    await eliminarTarea();
                    break;
                case "6":
                    await guardarTareas(); 
                    continuar = false;
                    console.log("Saliendo y guardando...");
                    break;
                case "0":
                    continuar = false;
                    console.log("Saliendo...")
                    break;
                default:
                    console.log("Ingrese un valor Valido");
                    break;
            }
        } catch (error) {
            console.error("Ocurrio un error durante la operacion:", error.message);
        }
    }
}

main();