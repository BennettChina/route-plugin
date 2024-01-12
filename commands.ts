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

export default <ConfigType[]>[ route ];