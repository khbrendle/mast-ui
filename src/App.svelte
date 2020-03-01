<script>
	import { onMount, beforeUpdate } from "svelte";
	// import ColumnMappingComponent from "./ColumnMappingComponent.svelte";
	import ColumnTransform from "./ColumnTransform.svelte";
	// import GraphViz from "./GraphViz.svelte";
	import Home from "./Home.svelte";
	// import TableTransform from "./TableTransform.svelte";
	import UploadData from "./UploadData.svelte";

	import { Router, Link, Route } from "svelte-routing";

	// import TableCompose from "./TableCompose.svelte";
	import { Container, Row, Col } from "sveltestrap";

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
	<Router url="{url}">
		<nav class="nav-bar">
			<Container>
				<Row>
					<Col class="nav-link" style='background: white;'><Link to="/" style>Home</Link></Col>
					<Col class="nav-link" style='background: #e6e6e6;'><Link to="column-transform">Column Transform</Link></Col>
					<!-- <Col class="nav-link" style='background: white;'><Link to="table-transform">Table Transform</Link></Col> -->
					<Col class="nav-link" style='background: #e6e6e6;'><Link to="upload-data">Upload Data</Link></Col>
				</Row>
			</Container>
			<!-- <span class="nav-link">
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
			</span> -->
		</nav>
		<div>
		<Route path="/"><Home /></Route>
			<Route path="column-transform" component="{ColumnTransform}" />
			<!-- <Route path="table-transform" component="{TableTransform}" /> -->
			<Route path="upload-data" component="{UploadData}" />
		</div>
	</Router>

	<!-- testing new component -->
	<!-- <TableMappingComponent /> -->

</div>

<style>
  .nav-bar {
    background-color: #52baeb;
    /* margin: 7px; */
    padding: 8px;
  }
  .nav-link {
    display: flex;
    flex-flow: column;
    background-color: white;
    margin: 3px;
    padding: 5px;
    color: white;
    border-color: black;
    border-style: dashed;
    border-width: 1px;
    width: 200px;
  }
</style>
