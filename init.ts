import { definePlugin } from "@/modules/plugin";
import cfgList from "./commands";
import { MetaManagement } from "#/route-plugin/module/meta";
import { RouteClass } from "#/route-plugin/module/route";
import { Logger } from "log4js";
import { getFileSize } from "@/utils/network";
import Progress from "@/utils/progress";
import { formatMemories } from "@/utils/format";

export let metaManagement: MetaManagement;
export let routeClass: RouteClass;

export default definePlugin( {
	name: "路线查询",
	cfgList,
	assets: {
		manifestUrl: "https://source.hibennett.cn/bot/genshin/route/manifest.yml",
		downloadBaseUrl: "https://source.hibennett.cn",
		async overflowHandle( assets, pluginKey, { logger, file } ) {
			const gLogger = new Proxy( logger, {
				get( target: Logger, p: string | symbol ): any {
					return ( content: string ) => target[p]( `${ pluginKey } 插件: ${ content }` );
				}
			} );
			gLogger.info( `[${ pluginKey }] 待更新资源数量超出限制，开始下载压缩资源包...` );
			// 超出时下载整包资源
			const fileUrl = "https://source.hibennett.cn/bot/genshin/route/adachi-assets.zip";
			const totalSize = await getFileSize( fileUrl );
			let downloadSize = 0;
			const progress = new Progress( `下载 ${ pluginKey } 插件整包资源`, totalSize || 0 );
			
			const startTime = Date.now();
			
			// 压缩包下载目标路径
			const zipDownloadPath: string = `${ pluginKey }/adachi-assets.zip`;
			try {
				await file.downloadFileStream( fileUrl, zipDownloadPath, "plugin", chunk => {
					const curLength = chunk.length;
					downloadSize += curLength;
					if ( !totalSize ) {
						progress.setTotal( downloadSize );
					}
					// 下载进度条
					progress.renderer( downloadSize, () => {
						if ( totalSize ) {
							const elapsedTime = ( Date.now() - startTime ) / 1000;
							const averageSize = downloadSize / elapsedTime;
							
							const fDownloadSize = formatMemories( downloadSize, "M" );
							const fTotalSize = formatMemories( totalSize, "M" );
							const fAverageSize = formatMemories( averageSize, averageSize < 1024 * 1024 ? "KB" : "M" );
							return `${ fDownloadSize }/${ fTotalSize } ${ fAverageSize }/s`;
						}
						return formatMemories( downloadSize, "M" );
					} )
				} );
			} catch ( error ) {
				gLogger.error( "资源包下载失败:" + ( <Error>error ).stack );
				throw error;
			}
			// 压缩包解压目标路径
			const zipUnCompressPath = `${ pluginKey }/${ assets.folderName || "adachi-assets" }`;
			/* 此时存在原有资源文件，先进行删除 */
			const { type: originPathFileType } = await file.getFileType( zipUnCompressPath, "plugin" );
			if ( originPathFileType === "directory" ) {
				gLogger.info( "正在清除原有资源文件..." );
				const { status: deleteStatus } = await file.deleteFile( zipUnCompressPath, "plugin" );
				if ( !deleteStatus ) {
					gLogger.error( "清除原有资源文件失败，请尝试手动解压替换" );
					return;
				}
			}
			gLogger.info( "开始解压资源包..." );
			const { status: unCompressStatus } = await file.unCompressFile( "zip", zipDownloadPath, zipUnCompressPath, "plugin" );
			if ( !unCompressStatus ) {
				gLogger.error( "解压资源包失败，请尝试手动解压替换" );
				return;
			}
			gLogger.info( "资源包解压完成" );
			await file.deleteFile( zipDownloadPath, "plugin" );
			return true;
		},
		replacePath: path => path.replace( "bot/genshin/route", "" )
	},
	repo: {
		owner: "BennettChina",
		repoName: "route-plugin",
		ref: "master"
	},
	async mounted( params ) {
		metaManagement = new MetaManagement( params.file, params.logger );
		metaManagement.watchStart();
		routeClass = new RouteClass();
	},
	async unmounted() {
		metaManagement.clear();
		await metaManagement.watchClose();
	}
} )