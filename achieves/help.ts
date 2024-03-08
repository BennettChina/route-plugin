import { defineDirective } from "@/modules/command";
import { renderer, routeClass } from "#/route-plugin/init";

export default defineDirective( "order", async ( { sendMessage, redis } ) => {
	const routes = routeClass.routes;
	await redis.setString( "route-plugin.help", JSON.stringify( routes ), 60 );
	const result = await renderer.asSegment( "/index.html", undefined, { width: 1000, height: 2000 } );
	if ( result.code === 'ok' ) {
		await sendMessage( result.data );
	}
	
} );