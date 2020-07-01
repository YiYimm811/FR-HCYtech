import axios from 'axios';
export default class Ajax {

    static async get(url, params = {}) {
        return (await axios.get(url, { params: params })).data;
    }

    static async post(url, body, params = {}) {
        return (await axios.post(url, body, { params: params })).data;
    }

    static async put(url, body, params = {}) {
        return (await axios.put(url, body, { params: params })).data;
    }

    static async delete(url, params = {}) {
        return (await axios.delete(url, { params: params })).data;
    }
}