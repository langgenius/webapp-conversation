declare module 'dify-client' {
    export const BASE_URL: string;

    interface Routes {
        [key: string]: {
            method: string,
            url: (param?: string) => string,
        };
    }

    export const routes: Routes;

    export class DifyClient {
        constructor(apiKey: string, baseUrl?: string);

        updateApiKey(apiKey: string): void;

        sendRequest(
            method: string,
            endpoint: string,
            data?: any,
            params?: any,
            stream?: boolean,
            headerParams?: any
        ): Promise<any>;

        messageFeedback(message_id: string, rating: number, user: any): Promise<any>;

        getApplicationParameters(user: any): Promise<any>;

        fileUpload(data: any): Promise<any>;
    }

    export class CompletionClient extends DifyClient {
        createCompletionMessage(inputs: any, user: any, stream?: boolean, files?: any): Promise<any>;
    }

    export class ChatClient extends DifyClient {
        createChatMessage(
            inputs: any,
            query: any,
            user: any,
            stream?: boolean,
            conversation_id?: string,
            files?: any
        ): Promise<any>;

        getConversationMessages(
            user: any,
            conversation_id?: string,
            first_id?: any,
            limit?: number
        ): Promise<any>;

        getConversations(user: any, first_id?: any, limit?: number, pinned?: any): Promise<any>;

        renameConversation(conversation_id: string, name: string, user: any, auto_generate: boolean): Promise<any>;

        deleteConversation(conversation_id: string, user: any): Promise<any>;
    }
}
declare module 'uuid';
