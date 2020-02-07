<script>
  import { onMount, afterUpdate } from "svelte";
  import { ColumnMappingValue } from "./objects.js";

  export let props = new ColumnMappingValue().newField();
  $: props = props;

  // console.log("object ", props, " is arg: ", props.isArg);

  let mappingTypes = [
    { id: 0, text: "Field" },
    { id: 1, text: "Value" },
    { id: 2, text: "Function" }
  ];

  let fieldTables = [
    { id: 0, text: "person" },
    { id: 1, text: "visit" }
  ];

  let handleAddArgument = () => {
    props.args = [
      ...props.args,
      new ColumnMappingValue().newField(props.args.length)
    ];
  };

  let handleSelectType = e => {
    console.log("handling select");
    props = new ColumnMappingValue().fromType(e.target.value, props.argIndex);
  };

  function handleWrap() {
    props = new ColumnMappingValue().newWrapper(props.isArg, props);
  }

  function handleMoveArgUp(idx) {
    console.log("moving up index ", idx);
    props = props.moveArgUp(idx);
    console.log("new props after move Up: ", props);
  }

  function handleMoveArgDown(idx) {
    console.log("moving down index ", idx);
    props = props.moveArgDown(idx);
  }

  function handleDelete(argsIndex) {
    console.log(`removing function argument at index ${argsIndex}`);
    console.log(`props has ${props.args.length} args`);
    props.args.splice(argsIndex, 1);
    props.args = props.args;
  }

  function handleReset() {
    console.log("removing function argument");
    props = new ColumnMappingValue().fromType(props.type, props.argsIndex);
  }

  // afterUpdate(() => {
  //   console.log("new props after update: ", props);
  // });
</script>

<div class='outer'>
  <!-- <p>argIndex: {props.argIndex}</p> -->
  <select class='type-select dropdown' bind:value={props.type} on:change={handleSelectType}>
    {#each mappingTypes as type}
      <option id={type.id} value={type.text}>
        {type.text}
      </option>
    {/each}
  </select>
  {#if !props.isArg}
  <button class='wrap-button btn btn-default btn-sm' type='button' disabled=true on:click|preventDefault={() => handleDelete(props.argsIndex)}>
  <span class="glyphicon glyphicon-remove"></span>
  </button>
  {/if}
  <button class='wrap-button btn btn-default btn-sm' type='button' on:click={handleWrap}>Wrap</button>
  <button class='wrap-button btn btn-default btn-sm' type='button' on:click={handleReset}>
    <span class="glyphicon glyphicon-refresh"></span>
  </button>
  <div class="inner">
  {#if props.type === 'Field'}
    <input class="field_table" placeholder='Table' bind:value={props.field.table} list="field_tables">
    <datalist id="field_tables">
    {#each fieldTables as ft}
      <option value={ft.text}>
    {/each}
    </datalist>
    <input class="field_column" placeholder='Column' bind:value={props.field.column}>
  {:else if props.type === 'Value'}
      <input id="value" placeholder="Value" bind:value={props.value}>
  {:else if props.type === 'Function'}
    <input class="function" placeholder="Function" bind:value={props.function}>

    <button type='button' on:click={handleAddArgument}>Add argument</button>
    <div class='func-args' >
      {#each props.args as arg, idx}
        <button class='up-arrow btn btn-default btn-sm' type='button' on:click|preventDefault={() => handleMoveArgUp(idx)}>
          <span class="glyphicon glyphicon-chevron-up"></span>
        </button>
        {#if arg.isArg}
        <button class='delete-arg-button wrap-button btn btn-default btn-sm' type='button' on:click|preventDefault={() => handleDelete(idx)}>
        <span class="glyphicon glyphicon-remove"></span>
        </button>
        {/if}
        <svelte:self bind:props={arg} />
        <button class='down-arrow btn btn-default btn-sm' type='button' on:click|preventDefault={() => handleMoveArgDown(idx)}>
          <span class="glyphicon glyphicon-chevron-down"></span>
        </button>
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
  .up-arrow {
    position: relative;
    top: 27px;
    left: 50%;
    height: 20px;
    line-height: 5px;
  }
  .down-arrow {
    position: relative;
    bottom: 29px;
    left: 50%;
    height: 20px;
    line-height: 5px;
  }
  .delete-arg-button {
    position: relative;
    top: 28px;
    right: 5px;
  }
</style>
