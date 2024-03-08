import { urlParamsParse } from "./url.js";

/**
 * @typedef {RequestInit} ServerConfig
 * @property {string} [baseURL]
 */

/**
 *
 * @param {string} url
 * @param {Object} [params]
 * @param {"GET" | "POST" | "PUT" | "DELETE"} [method]
 * @param {ServerConfig} [config]
 * @returns {Promise<Response>}
 */
export default function getServer( url, params = {}, method = "GET", config = {} ) {
	const baseUrl = config.baseURL || "/route-plugin/api";
	url = baseUrl + url;
	Reflect.deleteProperty( config, "baseURL" );
	const serverConfig = { method };
	if ( [ "GET", "DELETE" ].includes( method ) ) {
		url = urlParamsParse( url, params );
	} else {
		serverConfig.headers = {
			"Content-Type": "application/json",
		}
		serverConfig.body = JSON.stringify( params );
	}
	
	return fetch( url, { ...serverConfig, ...config } ).then( res => {
		if ( !res.ok ) {
			throw new Error( res.statusText );
		}
		return res.json();
	} );
}