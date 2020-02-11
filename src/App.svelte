<script>
	import { onMount, beforeUpdate } from "svelte";
	import ColumnMappingComponent from "./ColumnMappingComponent.svelte";
	import { ColumnMappingValue } from "./objects.js";
	import { Container, Col, Row } from 'sveltestrap';
	// import "./App.css"
	// 3 level nesting
	// let input =
	//   '{"type":"Function","field":{"table":"","column":""},"value":"","function":"f.concat","args":[{"type":"Function","field":{"table":"","column":""},"value":"","function":"f.lit","args":[{"type":"Value","field":{"table":"","column":""},"value":"static text","function":"","args":[]}]}]}';
	let input = `{"type":"Function","isArg":false,"argIndex":null,"field":{"table":"","column":""},"value":"","function":"","args":[{"type":"Field","isArg":true,"argIndex":0,"field":{"table":"person","column":"first_name"},"value":"","function":"","args":[]},{"type":"Field","isArg":true,"argIndex":1,"field":{"table":"person","column":"last_name"},"value":"","function":"","args":[]}]}`;
	// start empty
	// var input = "";
	let child_value =
	  input === ""
	    ? new ColumnMappingValue()
	    : new ColumnMappingValue().fromJSON(input);
	$: child_value = child_value; // this will make sure the value gets updated on change
	function syntaxHighlight(json) {
	  json = json
	    .replace(/&/g, "&amp;")
	    .replace(/</g, "&lt;")
	    .replace(/>/g, "&gt;");
	  return json.replace(
	    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
	    function(match) {
	      var cls = "number";
	      if (/^"/.test(match)) {
	        if (/:$/.test(match)) {
	          cls = "key";
	        } else {
	          cls = "string";
	        }
	      } else if (/true|false/.test(match)) {
	        cls = "boolean";
	      } else if (/null/.test(match)) {
	        cls = "null";
	      }
	      return '<span class="' + cls + '">' + match + "</span>";
	    }
	  );
	}
</script>
<div class="app">
	<div class="wrapper">
		<Row>
		<Col class="col-sm-8">
			<h3>Target Mapping</h3>
			<ColumnMappingComponent bind:props={child_value} />
		</Col>
		<Col class="col-sm-4">
			<h3>Child Value</h3>
			<div class="jsonWrapper">{@html "<pre>" + syntaxHighlight(JSON.stringify(child_value, null, 3)) + "</pre>"}</div>
		</Col>
		</Row>
	</div>
</div>
