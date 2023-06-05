import { io } from 'socket.io-client';



export const createSocket = (query) => {


    return io('http://your-socket-server-url', {
        query: query
    });


};


export const a = (query) => {


    return io('http://your-socket-server-url', {
        query: query
    });


};

export const b = (query) => {


    return io('http://your-socket-server-url', {
        query: query
    });


};

export const c = (query) => {


    return io('http://your-socket-server-url', {
        query: query
    });


};



export const socket = createSocket(null);