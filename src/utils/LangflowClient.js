// export class LangflowClient {
//     constructor(baseURL, applicationToken) {
//         this.baseURL = baseURL;
//         this.applicationToken = applicationToken;
//     }

//     async post(endpoint, body, headers = {"Content-Type": "application/json"}) {
//         headers["Authorization"] = `Bearer ${this.applicationToken}`;
//         headers["Content-Type"] = "application/json";
//         const url = `${this.baseURL}${endpoint}`;
        
//         try {
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: {
//                     ...headers,
//                     'Access-Control-Allow-Origin': '*',
//                     'Access-Control-Allow-Methods': 'POST, OPTIONS',
//                     'Access-Control-Allow-Headers': 'Content-Type, Authorization'
//                 },
//                 mode: 'cors',
//                 credentials: 'include',
//                 body: JSON.stringify(body)
//             });

//             const responseMessage = await response.json();
//             if (!response.ok) {
//                 throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
//             }
//             return responseMessage;
//         } catch (error) {
//             console.error('Request Error:', error.message);
//             throw error;
//         }
//     }

//     async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
//         const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
//         return this.post(endpoint, { 
//             input_value: inputValue, 
//             input_type: inputType, 
//             output_type: outputType, 
//             tweaks: tweaks 
//         });
//     }

//     async runFlow(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate, onClose, onError) {
//         try {
//             const initResponse = await this.initiateSession(
//                 flowId, 
//                 langflowId, 
//                 inputValue, 
//                 inputType, 
//                 outputType, 
//                 stream, 
//                 tweaks
//             );
            
//             // Handle different response formats
//             if (initResponse?.error) {
//                 throw new Error(initResponse.error);
//             }

//             // Log the response for debugging
//             console.log('API Response:', initResponse);

//             return initResponse;
//         } catch (error) {
//             console.error('Error running flow:', error);
//             throw error;
//         }
//     }
// } 

export class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }
    
    async post(endpoint, body, headers = {"Content-Type": "application/json"}) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`;
        headers["Content-Type"] = "application/json";
        const url = `${this.baseURL}${endpoint}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            const responseMessage = await response.json();
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
            }
            return responseMessage;
        } catch (error) {
            console.error('Request Error:', error.message);
            throw error;
        }
    }

    async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
    }

    handleStream(streamUrl, onUpdate, onClose, onError) {
        const eventSource = new EventSource(streamUrl);

        eventSource.onmessage = event => {
            const data = JSON.parse(event.data);
            onUpdate(data);
        };

        eventSource.onerror = event => {
            console.error('Stream Error:', event);
            onError(event);
            eventSource.close();
        };

        eventSource.addEventListener("close", () => {
            onClose('Stream closed');
            eventSource.close();
        });

        return eventSource;
    }

    async runFlow(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate, onClose, onError) {
        try {
            const initResponse = await this.initiateSession(flowId, langflowId, inputValue, inputType, outputType, stream, tweaks);
            console.log('Init Response:', initResponse);
            if (stream && initResponse && initResponse.outputs && initResponse.outputs[0].outputs[0].artifacts.stream_url) {
                const streamUrl = initResponse.outputs[0].outputs[0].artifacts.stream_url;
                console.log(`Streaming from: ${streamUrl}`);
                this.handleStream(streamUrl, onUpdate, onClose, onError);
            }
            return initResponse;
        } catch (error) {
            console.error('Error running flow:', error);
            if (onError) onError('Error initiating session');
            throw error;
        }
    }
}