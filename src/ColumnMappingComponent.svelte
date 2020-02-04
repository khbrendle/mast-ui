<script>
  import { ColumnMappingValue } from "./objects.js";
  export let props = ColumnMappingValue;
  $: props = props;

  let selected = "Field";

  let mappingTypes = [
    { id: 1, text: "Field" },
    { id: 2, text: "Value" },
    { id: 3, text: "Function" }
  ];

  let handleAddArgument = () => {
    props.args = [...props.args, new ColumnMappingValue().newField()];
  };

  let handleSelectType = e => {
    console.log(e.target.value);
    props = new ColumnMappingValue().fromType(e.target.value);
  };
</script>

<div id='outer'>
  <select id='type-select' bind:value={selected} on:change={handleSelectType}>
    {#each mappingTypes as type}
      <option id={type.id} value={type.text}>
        {type.text}
      </option>
    {/each}
  </select>
  <button id='wrap-button'>Wrap</button>
  <div id="inner">
  {#if selected === 'Field'}
    <input id="field_table" placeholder='Field' bind:value={props.field.table}>
    <input id="field_column" placeholder='Column' bind:value={props.field.column}>
  {:else if selected === 'Value'}
      <input id="value" placeholder="Value" bind:value={props.value}>
  {:else if selected === 'Function'}
    <input id="function" placeholder="Function" bind:value={props.function}>

    <button type='button' on:click={handleAddArgument}>Add argument</button>
    <div id='func-args' bind:this={props.args}>
      {#each props.args as arg}
        <svelte:self props={arg}/>
      {/each}
    </div>
  {:else }
    {alert("Type not supported")}
  {/if}
  </div>
</div>

<style>
					input {
					  right: 10px;
					  width: 200px;
					}
					#type-select {
					  position: relative;
					  left: 10px;
					  top: 10px;
					}
					#inner {
					  /* display: flex; */
					  background-color: #52baeb;
					  margin: 10px;
					  padding: 10px;
					}
					#outer {
					  background-color: #52baeb;
					  margin: 5px;
					  border-color: black;
					  border-style: dashed;
					  border-width: 2px;
					}
					#func-args {
					  border-color: black;
					  border-style: dashed;
					  border-width: 2px;
					}
					#wrap-button {
					  float: right;
					  margin: 5px;
					}
</style>
