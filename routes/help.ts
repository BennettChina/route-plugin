import express from "express";
import bot from "ROOT";

export default express.Router().get( "/", async ( req, res ) => {
	const data = await bot.redis.getString( "route-plugin.help" );
	if ( !data ) {
		return res.status( 404 ).send( "Not Found" );
	}
	
	res.status( 200 ).send( JSON.parse( data ) );
} );