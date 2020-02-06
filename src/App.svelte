<script>
	import { onMount, beforeUpdate } from "svelte";
	import ColumnMappingComponent from "./ColumnMappingComponent.svelte";
	import { ColumnMappingValue } from "./objects.js";

	// 3 level nesting
	// let input =
	//   '{"type":"Function","field":{"table":"","column":""},"value":"","function":"f.concat","args":[{"type":"Function","field":{"table":"","column":""},"value":"","function":"f.lit","args":[{"type":"Value","field":{"table":"","column":""},"value":"static text","function":"","args":[]}]}]}';
	// start empty
	var input = "";
	let child_value =
	  input === ""
	    ? new ColumnMappingValue()
	    : new ColumnMappingValue().fromJSON(input);
	$: child_value = child_value; // this will make sure the value gets updated on change
</script>

<div >
	<ColumnMappingComponent bind:props={child_value} />
	<p> child value<br>
	{JSON.stringify(child_value, null, 2)}
	</p>
</div>
