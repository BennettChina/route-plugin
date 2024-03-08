const template = `
<div>
	<header style="text-align: center">
		<h1>路线查询-帮助</h1>
	</header>
	<div class="main-box">
		<div v-for="(v,k) in data" class="type-box">
			<div class="type-title">{{k}}</div>
			<div v-for="item in v" class="route-name">
				{{item.name}}{{item.alias ? "/"+item.alias.join("/") : ""}}
			</div>
		</div>
	</div>
</div>
`;

import $https from "../../assets/js/http.js";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent( {
	name: "App",
	template,
	setup() {
		const data = ref( null );
		
		async function getData() {
			const response = await $https( "/help" );
			data.value = Object.groupBy( response, ( { type } ) => type );
		}
		
		onMounted( () => {
			getData()
		} );
		
		return { data }
	}
} )