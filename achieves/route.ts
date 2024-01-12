import { defineDirective } from "@/modules/command";
import { routeClass } from "#/route-plugin/init";

export default defineDirective( "order", async ( { sendMessage, matchResult } ) => {
	const input = matchResult.match[0];
	const images = await routeClass.get( input );
	if ( images.length === 0 ) {
		await sendMessage( `没有找到 ${ input } 的路线图` );
		return;
	}
	await sendMessage( images );
} );