<script>
	import { onMount, beforeUpdate } from "svelte";
	// import ColumnMappingComponent from "./ColumnMappingComponent.svelte";
	import ColumnTransform from "./ColumnTransform.svelte";
	// import { ColumnMappingValue } from "./objects.js";
	// import GraphViz from "./GraphViz.svelte";
	import Home from "./Home.svelte";
	import TableTransform from "./TableTransform.svelte";
	import UploadData from "./UploadData.svelte";

	import { Router, Link, Route } from "svelte-routing";

	// 3 level nesting
	// let input =
	//   '{"type":"Function","field":{"table":"","column":""},"value":"","function":"f.concat","args":[{"type":"Function","field":{"table":"","column":""},"value":"","function":"f.lit","args":[{"type":"Value","field":{"table":"","column":""},"value":"static text","function":"","args":[]}]}]}';
	// let input = `{"type":"Function","isArg":false,"argIndex":null,"field":{"table":"","column":""},"value":"","function":"","args":[{"type":"Field","isArg":true,"argIndex":0,"field":{"table":"person","column":"first_name"},"value":"","function":"","args":[]},{"type":"Field","isArg":true,"argIndex":1,"field":{"table":"person","column":"last_name"},"value":"","function":"","args":[]}]}`;
	// // start empty
	// // var input = "";
	// let child_value =
	//   input === ""
	//     ? new ColumnMappingValue()
	//     : new ColumnMappingValue().fromJSON(input);
	// $: child_value = child_value; // this will make sure the value gets updated on change

	export let url = "";
</script>

<div >
	<!--
		this component contains the column transformation builder
	-->
	<!-- <ColumnMappingComponent bind:props={child_value} />
	<p> child value<br> </p> -->
	<!-- <div>{@html "<pre>" + JSON.stringify(child_value, null, 2) + "</pre>"}</div> -->
	<!-- <pre>{@html child_value.print()}</pre> -->
	<!-- <pre>{child_value.toString(null, 2)}</pre> -->

	<!--
		going to start another component for graph viz
	 -->
	<!-- <GraphViz /> -->

	<!--
		router
	 -->
	<!-- <Home /> -->

	<Router url="{url}">
		<nav class="nav-bar">
			<span class="nav-link">
				<Link to="/">Home</Link>
			</span>
			<span class="nav-link">
				<Link to="column-transform">Column Transform</Link>
			</span>
			<span class="nav-link">
				<Link to="table-transform">Table Transform</Link>
			</span>
			<span class="nav-link">
				<Link to="upload-data">Upload Data</Link>
			</span>
		</nav>
		<div>
		<Route path="/"><Home /></Route>
			<Route path="column-transform" component="{ColumnTransform}" />
			<Route path="table-transform" component="{TableTransform}" />
			<Route path="upload-data" component="{UploadData}" />
		</div>
	</Router>
</div>

<style>
  .nav-bar {
    background-color: #52baeb;
    /* margin: 7px; */
    padding: 8px;
  }
  .nav-link {
    background-color: white;
    margin: 3px;
    padding: 5px;
    /* color: white; */
    border-color: black;
    border-style: dashed;
    border-width: 1px;
  }
</style>
