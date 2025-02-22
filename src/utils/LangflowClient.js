export class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }

    async post(endpoint, body) {
        const url = `${this.baseURL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.applicationToken}`,
                },
                mode: 'cors',
                credentials: 'omit',
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Request Error:', error);
            throw error;
        }
    }

    async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        return this.post(endpoint, { 
            input_value: inputValue, 
            input_type: inputType, 
            output_type: outputType, 
            tweaks: tweaks 
        });
    }

    async runFlow(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate, onClose, onError) {
        try {
            const initResponse = await this.initiateSession(
                flowId, 
                langflowId, 
                inputValue, 
                inputType, 
                outputType, 
                stream, 
                tweaks
            );
            
            return initResponse;
        } catch (error) {
            console.error('Error running flow:', error);
            throw error;
        }
    }
} 