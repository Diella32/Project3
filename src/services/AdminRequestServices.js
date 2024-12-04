import apiClient from "./services";
var baseURL = "/requests/";

export default{
    getAll(){
        return apiClient.get(baseURL);
    },
    getOne(requestId){
        return apiClient.get(baseURL + `requestId/${requestId}`);
    },
    getAllForStudent(studentId){
        return apiClient.get(baseURL + `studentReq/${studentId}`);
    },
    getAllForStatus(status, semesterId, studentId){
        return apiClient.get(baseURL + `statusReq/${status}`);
    },
    create(data){
        return apiClient.post(baseURL, data);
    },
    update(requestId, data){
        return apiClient.put(baseURL + `${requestId}`, data);
    },
    delete(requestId){
        console.log('deleting ' + requestId);
        return apiClient.delete(baseURL+`${requestId}`);
    }
};