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

	function syntaxHighlight(json) {
		json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
				var cls = 'number';
				if (/^"/.test(match)) {
						if (/:$/.test(match)) {
								cls = 'key';
						} else {
								cls = 'string';
						}
				} else if (/true|false/.test(match)) {
						cls = 'boolean';
				} else if (/null/.test(match)) {
						cls = 'null';
				}
					return '<span class="' + cls + '">' + match + '</span>';
			});
		}

</script>

<div >
	<ColumnMappingComponent bind:props={child_value} />
	<p> child value<br> </p>
	<div>{@html "<pre>" + syntaxHighlight(JSON.stringify(child_value, null, 2)) + "</pre>"}</div>

</div>
