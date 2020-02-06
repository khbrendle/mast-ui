<script>
  import { onMount, beforeUpdate } from "svelte";
  import { ColumnMappingValue } from "./objects.js";
  export let props = new ColumnMappingValue().newField();
  $: props = props;

  let mappingTypes = [
    { id: 1, text: "Field" },
    { id: 2, text: "Value" },
    { id: 3, text: "Function" }
  ];

  let handleAddArgument = () => {
    props.args = [...props.args, new ColumnMappingValue().newField()];
  };

  let handleSelectType = e => {
    console.log("handling select");
    props = new ColumnMappingValue().fromType(e.target.value);
  };

  function handleWrap() {
    props = new ColumnMappingValue().newWrapper(props);
  }
</script>

<div class='outer'>
  <select class='type-select' bind:value={props.type} on:change={handleSelectType}>
    {#each mappingTypes as type}
      <option id={type.id} value={type.text}>
        {type.text}
      </option>
    {/each}
  </select>
  <button class='wrap-button' type='button' on:click={handleWrap}>Wrap</button>
  <div class="inner">
  {#if props.type === 'Field'}
    <input class="field_table" placeholder='Table' bind:value={props.field.table}>
    <input class="field_column" placeholder='Column' bind:value={props.field.column}>
  {:else if props.type === 'Value'}
      <input id="value" placeholder="Value" bind:value={props.value}>
  {:else if props.type === 'Function'}
    <input class="function" placeholder="Function" bind:value={props.function}>

    <button type='button' on:click={handleAddArgument}>Add argument</button>
    <div class='func-args' >
      {#each props.args as arg}
        <svelte:self bind:props={arg}/>
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
	.type-select {
	  position: relative;
	  left: 10px;
	  top: 10px;
	}
	.inner {
	  /* display: flex; */
	  background-color: #52baeb;
	  margin: 10px;
	  padding: 10px;
	}
	.outer {
	  background-color: #52baeb;
	  margin: 5px;
	  border-color: black;
	  border-style: dashed;
	  border-width: 2px;
	}
	.func-args {
	  border-color: black;
	  border-style: dashed;
	  border-width: 2px;
	  padding-top: 20px;
	  padding-bottom: 20px;
	}
	.wrap-button {
	  float: right;
	  margin: 5px;
	}
</style>
