/**
 * Consigna:
 * # 1: Generar proyecto por medio de npm init -y <type:module start:node index.js>
 * # 2: uso process.argv para tomar los argumentos requeridos GET products, GET products/<products ID>
 *      POST products <titulo><precio><categoria> y DELETE products <id>
 * NOTA: Cuando damos de alta un producto es importante para las descripcion y el titulo se debe colocar entre
 * comillas dobles o simples.
 * 
 */
console.log("Inicio del Trabajo Practico - Nelson Silva")
// Función para recuperar datos
const administrarDatos = async (cUrl, cConfig = {}) => {
    try {
        const respuesta = await fetch(cUrl,cConfig)
        if(!respuesta.ok) {
            throw new Error(`Error al conectarse con ${cUrl} Error: ${respuesta.status}`)
        }
        const datos = await respuesta.json()
        if(!datos || datos.length===0) {
            return []
        }
        return datos
    } catch (error) {
        console.log(error)
        return []
    }
}

const enviarDatos = async (cUrl, aDatos) => {
    try {
        // A partir del array genero el objeto con la información para el alta
        const producto = new nuevoProducto(aDatos[0], parseFloat(aDatos[1]), aDatos[2])
        // Genero la configuracion del servicio metodo header y cuerpo del mensaje
        let configuracion = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        }
        // Envio la información 
        const respuesta = await fetch(cUrl,configuracion)
        if(!respuesta.ok) {
            throw new Error(`Error al envíar información a la API: ${respuesta.status}`)
        }
        const data = respuesta.json()
        if (!data || data.length === 0) {
            return []
        }
        return data
    } catch (error){
        console.log('Error en el proceso', error)
    }
}

// Función constructora del nuevo objeto
function nuevoProducto (titulo = '', precio = 0, categoria = '') {
    this.title = titulo
    this.price = precio
    this.category = categoria
}



// Proceso General

const argumentos = process.argv.slice(2)
if(argumentos.length <= 1){
    console.log("No recibo argumentos para procesar")
} else  {
    let cUrl =  'https://fakestoreapi.com/'
    // Condicional
    switch (argumentos[0].toUpperCase()) {
        case 'GET':
            // Solicitud de toda la lista
            cUrl = cUrl+argumentos[1].trimEnd()
            console.log(`Recuperando datos de ${cUrl} por favor espere...`)
            const productos = await administrarDatos(cUrl)
            console.log(productos)
            break;

        case 'POST':
            // Alta de un nuevo producto se espera tres datos para agregar el primer y ultimo argumento
            // deben estar con comillas. si es mas o menos arroja una excepcion
            let datos = argumentos.slice(1)
            if(datos.length>3 || datos.length<3) {
                console.log("La cantidad de argumentos no es válida")
            } else {
                cUrl = cUrl + 'products'
                const procesado = await enviarDatos(cUrl,datos)
                console.log('Resultado del proceso: ',procesado)
            }
            break;

        case 'DELETE':
            // Según la consigna recibe products mas el ID
            if(argumentos.length>3 || argumentos <3){
                console.log('La cantidad de argumentos no es válida')
            } else {
                cUrl = cUrl+argumentos[1].trimEnd()+'/'+argumentos[2]
                const eliminado = await administrarDatos(cUrl,{method:'DELETE'})
                console.log(eliminado)
            }
            break;
        default:
            console.log("El comando no es reconocido")
            break;
    }   
}