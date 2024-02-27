import axios from 'axios';

export class UtilsFunctions {
    public baseUrl: string;
    public apiKey: string;

    constructor() {
        //La URL base aqu si todas las funciones comparten la misma base
        this.baseUrl = 'https://fn-quala-api.azurewebsites.net/api/';
        this.apiKey = 'g-LzFWFmkAn7xUf5zIAIpjC27OBW-woWSD3t7PuCCDwYAzFuY4adDg==';
    }

    // Mtodo para obtener datos (Leer en CRUD)
    async GetItems(data:any) {
        try {
            const response = await axios.post(`${this.baseUrl}GetItemsRoot`,data, { headers: { 'x-functions-key': this.apiKey }});
            return response.data;
        } catch (error) {
            console.error('Error al obtener datos:', error);
            throw error; // Puedes decidir si quieres lanzar el error o manejarlo de otra manera
        }
    }

    // Mtodo para crear un nuevo tem (Crear en CRUD)
    async crearItem(item:any) {
        try {
            const response = await axios.post(`${this.baseUrl}tuFuncionCrearItem`, item);
            return response.data;
        } catch (error) {
            console.error('Error al crear el tem:', error);
            throw error;
        }
    }

    // Mtodo para actualizar un tem (Actualizar en CRUD)
    async actualizarItem(id:any, item:any) {
        try {
            const response = await axios.put(`${this.baseUrl}tuFuncionActualizarItem/${id}`, item);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el tem:', error);
            throw error;
        }
    }

    // Mtodo para eliminar un tem (Eliminar en CRUD)
    async eliminarItem(id:any) {
        try {
            const response = await axios.delete(`${this.baseUrl}tuFuncionEliminarItem/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar el tem:', error);
            throw error;
        }
    }
    
}
