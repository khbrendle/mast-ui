<script>
		import ColumnMappingComponent from "./ColumnMappingComponent.svelte";
		import { ColumnMappingValue } from "./objects.js";

		let child_value = new ColumnMappingValue().newField();
		$: child_value = child_value; // this will make sure the value gets updated on change
</script>


<div >
	<ColumnMappingComponent bind:props={child_value} />
	<p> child value<br>
	{JSON.stringify(child_value)}
	</p>
</div>
