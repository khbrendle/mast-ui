<script>
  import { onMount, afterUpdate } from "svelte";
  import { FieldTransform } from "./objects/FieldTransform.js";
  import { Col, Row, Container, Collapse, Button } from "sveltestrap";

  export let disabled = false;
  $: disabled = disabled;

  export let props = new FieldTransform().newField();
  $: props = props;

  // console.log("object ", props, " is arg: ", props.is_arg);

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
      new FieldTransform().newField(props.args.length)
    ];
  };

  let handleSelectType = e => {
    console.log("handling select");
    props = new FieldTransform().fromType(e.target.value, props.arg_index);
  };

  function handleWrap() {
    props = new FieldTransform().newWrapper(props.is_arg, props.arg_index, props);
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
    props = new FieldTransform().fromType(
      props.type,
      props.arg_index === null ? undefined : props.arg_index
    );
  }

  // afterUpdate(() => {
  //   console.log("new props after update: ", props);
  // });
</script>

<div class='outer'>
  <!-- <p>arg_index: {props.arg_index}</p> -->
  <select class='type-select dropdown' disabled={disabled} bind:value={props.type} on:change={handleSelectType}>
    {#each mappingTypes as type}
      <option id={type.id} value={type.text}>
        {type.text}
      </option>
    {/each}
  </select>
  <!--
    wrap and reset buttons here because they are needed at the object level,
    hidden delete button just for consistency
  -->
  {#if !props.is_arg}
  <!-- this button should always disabled, can't delete the top-most object -->
  <button class='wrap-button btn btn-default btn-sm' type='button' disabled=true on:click|preventDefault={() => handleDelete(props.arg_index)}>
  <span class="glyphicon glyphicon-remove"></span>
  </button>
  {/if}
  <button class='wrap-button btn btn-default btn-sm' type='button' disabled={disabled} on:click={handleWrap}>Wrap</button>
  <button class='wrap-button btn btn-default btn-sm' type='button' disabled={disabled} on:click={handleReset}>
    <span class="glyphicon glyphicon-refresh"></span>
  </button>

  <div class="inner">
  {#if props.type === 'Field'}
    <input class="field_table" placeholder='Table' bind:value={props.field.table} disabled={disabled} list="field_tables">
    <datalist id="field_tables">
    {#each fieldTables as ft}
      <option value={ft.text}>
    {/each}
    </datalist>
    <input class="field_column" placeholder='Column' bind:value={props.field.column} disabled={disabled}>
  {:else if props.type === 'Value'}
      <input id="value" placeholder="Value" bind:value={props.value} disabled={disabled}>
  {:else if props.type === 'Function'}
    <input class="function" placeholder="Function" bind:value={props.function} disabled={disabled}>

    <button type='button' on:click={handleAddArgument} disabled={disabled}>Add argument</button>
    <div class='func-args' >
      {#each props.args as arg, idx}
      <div class="inner nest-item">
      <!-- move and delete buttons here so that parent can control child objects -->
        <button class='up-arrow btn btn-default btn-sm' type='button' disabled={disabled} on:click|preventDefault={() => handleMoveArgUp(idx)}>
          <span class="glyphicon glyphicon-chevron-up"></span>
        </button>
        {#if arg.is_arg}
        <button class='delete-arg-button wrap-button btn btn-default btn-sm' type='button' disabled={disabled} on:click|preventDefault={() => handleDelete(idx)}>
        <span class="glyphicon glyphicon-remove"></span>
        </button>
        {/if}
        <svelte:self bind:props={arg} />
        <button class='down-arrow btn btn-default btn-sm' type='button' disabled={disabled} on:click|preventDefault={() => handleMoveArgDown(idx)}>
          <span class="glyphicon glyphicon-chevron-down"></span>
        </button>
      </div>
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
    /* padding-top: 20px;
                                              padding-bottom: 20px; */
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
  .nest-item {
    padding: 0px;
    margin: 0px 10px;
  }
</style>
