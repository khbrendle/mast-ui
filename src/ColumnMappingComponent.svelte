<script>
  import { onMount, beforeUpdate } from "svelte";
  import { ColumnMappingValue } from "./objects.js";

  export let props = new ColumnMappingValue().newField();
  $: props = props;

  export let isArg = false;
  console.log("object ", props, " is arg: ", isArg);
  export let argIndex = null;

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

  function handleMoveArgUp(idx) {
    console.log("moving up index ", idx);
    props.moveArgUp(idx);
    console.log("new props: ", props);
  }

  function handleMoveArgDown(idx) {
    console.log("moving down index ", idx);
    props.moveArgDown(idx);
  }
</script>

<div class='outer'>
  <p>argIndex: {argIndex}</p>
  <select class='type-select' bind:value={props.type} on:change={handleSelectType}>
    {#each mappingTypes as type}
      <option id={type.id} value={type.text}>
        {type.text}
      </option>
    {/each}
  </select>
  {#if isArg}
    <!-- <button class='up-arrow' type='button' on:click|preventDefault={() => handleMoveArgUp(argIndex)}>&#8593;</button> -->
  {/if}
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
      {#each props.args as arg, idx}
        <button class='up-arrow' type='button' on:click|preventDefault={() => handleMoveArgUp(idx)}>&#8593;</button>
        <svelte:self bind:props={arg} isArg={true} argIndex={idx}/>
      {/each}
    </div>
  {:else }
    {alert("Type not supported")}
  {/if}
  </div>
  <!-- {#if isArg}
    <button class='down-arrow' type='button' on:click|preventDefault={() => handleMoveArgDown(argIndex)}>&#8595;</button>
  {/if} -->
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
									.up-arrow {
									  position: absolute;
									  left: 50%;
									  height: 20px;
									  line-height: 5px;
									}
									.down-arrow {
									  position: relative;
									  bottom: -6px;
									  left: 50%;
									  height: 20px;
									  line-height: 5px;
									}
</style>
