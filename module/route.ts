import { metaManagement } from "#/route-plugin/init";
import { segment } from "@/modules/lib";
import bot from "ROOT";
import fs from "fs";

export type Route = Array<{
	name: string;
	type: string;
	alias?: string[];
	images: string[];
}>

export class RouteClass {
	
	public get routes() {
		return metaManagement.getMeta( "meta/route" );
	}
	
	public async get( input: string ) {
		const route = this.routes.find( value => value.name === input || ( value.alias && value.alias.includes( input ) ) );
		if ( !route ) {
			return [];
		}
		return route.images.map( img => {
			const path = bot.file.getFilePath( `route-plugin/adachi-assets/resource/${ route.type }/${ img }`, "plugin" );
			const buffer = fs.readFileSync( path );
			return segment.image( buffer )
		} );
	}
}