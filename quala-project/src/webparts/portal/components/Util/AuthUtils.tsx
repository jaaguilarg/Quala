import * as adal from 'adal-node';
const msal = require('@azure/msal-node');


export class AuthUtils {
    private static clientId: string = "324cb43f-6516-40f3-b627-623df32167b9";
    private static clientSecret: string = "JEz8Q~kd.Y-pgb8Ef6D_p1qK1h771WufSGbCGah0";
    private static tenantId: string = "bfb2a438-52d8-4042-adfa-cbe28265d7ce";
    private static resource: string = "https://bigsa.sharepoint.com";

    static msalConfig = {
        auth: {
            clientId: this.clientId,
            authority: "https://login.microsoftonline.com/bfb2a438-52d8-4042-adfa-cbe28265d7ce",
            clientSecret: this.clientSecret,
        }
    };

    static cca = new msal.ConfidentialClientApplication(this.msalConfig);



    static async getAccessTokenMSAL(): Promise<string> {
        return new Promise((resolve, reject) => {
            const authorityUrl = `https://login.microsoftonline.com/${this.tenantId}`;
            const context = new adal.AuthenticationContext(authorityUrl);

            context.acquireTokenWithClientCredentials(
                this.resource,
                this.clientId,
                this.clientSecret,
                (err:any, tokenResponse:any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve((tokenResponse as adal.TokenResponse).accessToken);
                }
            );
        });
    }

    static async obtenerAccessTokenAzureFunction(): Promise<string> {
        const urlFuncionAzure = 'https://fn-obtener-tocken.azurewebsites.net/api/GetTokenAd'; 
        const apiKey = 'p1eO9JjcSwJ8qCd3TPeP_vVJ_xsbA2jm359Amwv0ntnRAzFu5A8RRw=='; 

        try {
            const response = await fetch(urlFuncionAzure,  {
                headers: {
                    'x-functions-key': apiKey
                }});
            if (!response.ok) { 
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            return data.accessToken;
        } catch (error) {
            console.error('Error al obtener el token de Azure Function:', error);
            throw error;
        }
    }

    
    static async getAccessToken() {
        const tokenRequest = {
            scopes: ["https://graph.microsoft.com/.default"], // Modifica segn tus necesidades
            skipCache: false, // Esto evita buscar en cach y obtiene un nuevo token
        };

        try {
            const response = await this.cca.acquireTokenByClientCredential(tokenRequest);
            return response.accessToken;
        } catch (error) {
            console.error('Error en la obtencin del token:', error);
            throw error;
        }
    }
    
}
