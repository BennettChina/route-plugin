import { ConfigType, OrderConfig } from "@/modules/command";
import { MessageScope } from "@/modules/message";
import { AuthLevel } from "@/modules/management/auth";

const route: OrderConfig = {
	type: "order",
	headers: [ "路线查询" ],
	cmdKey: "route-plugin.route",
	desc: [ "路线查询", "" ],
	regexps: [ ".*" ],
	scope: MessageScope.Both,
	auth: AuthLevel.User,
	main: "achieves/route",
	detail: "查询原神锄大地的资源路线。"
}

const help: OrderConfig = {
	type: "order",
	headers: [ "路线菜单" ],
	cmdKey: "route-plugin.help",
	desc: [ "路线菜单", "" ],
	regexps: [],
	scope: MessageScope.Both,
	auth: AuthLevel.User,
	main: "achieves/help",
	detail: "路线查询的帮助功能，用来查询支持的路线列表。"
}

export default <ConfigType[]>[ route, help ];