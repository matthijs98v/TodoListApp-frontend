import { ref } from 'vue';
import { defineStore } from 'pinia'
import * as signalR from "@microsoft/signalr";

export const useWebsocketStore = defineStore('websockets', () => {

    const connection = ref(null);
    const lastGroup = ref(null);

    async function connect() {
        connection.value = new signalR.HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_API_URL}/todoHub`)
            .withAutomaticReconnect()
            .build();
        
        if (connection.value != null) {
            await connection.value.start();
        }
    }

    function setLastGroup(name) {
        lastGroup.value = name;
    }
    
    return { connection, connect, lastGroup, setLastGroup}
})
