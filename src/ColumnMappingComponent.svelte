<script>
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import {
    FieldTransform,
    newFieldTransform,
    newEquality,
    Equality
  } from "./objects/FieldTransform.js";
  import { getTable, getField, optionsCache } from "./utils/api.js";
  import { newRandomID } from "./utils/utils.js";
  import { get } from "svelte/store";
  import { Col, Row, Container, Input, CustomInput, Button } from "sveltestrap";

  const uniqID = newRandomID();
  // used to create a beforeMount hook
  let init = true;

  // this will control all inputs/buttons/selects
  export let disabled = false;
  // $: disabled = disabled;

  // main result of component
  export let props = new FieldTransform().newField();
  $: props = props;

  let moveBtnStyle = "margin: 5px auto; display: flex;";

  // static set of available mapping types
  let mappingTypes = [
    { id: 0, text: "Field" },
    { id: 1, text: "Value" },
    { id: 2, text: "Function" }
  ];

  let fieldKey = "";
  // $: fieldKey = fieldKey;
  let tableKey = "";
  // $: tableKey = tableKey;

  // optional array of allowed tables
  // let allowdTables = [
  //   "bp0ad6jipt375iprc42g",
  //   "bp0ad6jipt375iprc48g",
  //   "bp0ad6jipt375iprc410"
  // ];
  export let allowedTables = [];
  // $: allowedTables = allowedTables;
  export let allowedFields = [];
  // $: allowedFields = allowedFields;

  const handleAddArgument = () => {
    console.log("adding argument");
    props.args = [
      ...props.args,
      new FieldTransform().newField(props.args.length)
    ];
    props = props;
  };

  const handleSelectType = e => {
    console.log("handling select");
    props = new FieldTransform().fromType(
      e.target.value,
      props.arg_index,
      props.alias,
      props.equality
    );
  };

  const handleWrap = () => {
    props = new FieldTransform().newWrapper(
      props.is_arg,
      props.arg_index,
      props,
      props.alias
    );
  };

  const handleMoveArgUp = idx => {
    // console.log("moving up index ", idx);
    props = props.moveArgUp(idx);
  };

  const handleMoveArgDown = idx => {
    // console.log("moving down index ", idx);
    props = props.moveArgDown(idx);
  };

  const handleDelete = () => {
    console.log("deleting...");
    props = null;
  };

  const handleReset = () => {
    props = new FieldTransform().fromType(
      props.type,
      props.arg_index === null ? undefined : props.arg_index
    );
  };
  const handleSelectTable = e => {
    // console.log("handling select table");
    props.field.table_id = e.target.options[e.target.selectedIndex].id;

    props.field.column = "";
    props.field.column_id = "";
    document.getElementById(`field-select-${uniqID}`).selectedIndex = 0;
    getField({ table_id: props.field.table_id }).then(data => {
      fieldKey = data[0];
    });
  };
  const handleSelectField = e => {
    props.field.column_id = e.target.options[e.target.selectedIndex].id;
  };
  const handleAddEquality = () => {
    console.log("adding equality");
    props.equality = newEquality();
  };
  const handleChainMethods = () => {
    props.chain_methods = [newFieldTransform(0)];
  };
  const handleChainMethod = () => {
    console.log("chaining another method");
    props.chain_methods = [
      ...props.chain_methods,
      newFieldTransform(props.chain_methods.length + 1)
    ];
  };

  beforeUpdate(() => {
    // console.log(`${uniqID}-${init}`);
    if (init) {
      console.log("mouting ColumnMappingComponent");
      getTable().then(data => {
        tableKey = data[0];
      });

      if (props.field.column !== undefined && props.field.column !== "") {
        getField({ table_id: props.field.table_id }).then(data => {
          fieldKey = data[0];
        });
      }
      init = false;
    }
    if (props !== undefined) {
      console.log("deleting args");
      console.log(props);
      // handling deleting
      if (props !== null) {
        // remove deleted function arguments
        if (Object.keys(props).includes("args")) {
          if (props.args.length > 0) {
            var i = props.args.indexOf(null);
            // console.log(`removing arg at index ${i}`);
            if (i >= 0) {
              props.args.splice(i, 1);
            }
          }
        }

        // remove deleted chained methods arguments
        if (Object.keys(props).includes("chain_methods")) {
          var i = props.chain_methods.indexOf(null);
          if (i >= 0) {
            props.chain_methods.splice(i, 1);
          }
        }

        // remove deleted equality
        if (Object.keys(props).includes("equality")) {
          if (props.equality !== null) {
            if (props.equality.arg === null) {
              // reset to default
              props.equality = null;
            }
          }
        }
      }
    }

    // this helps the select menus for table and field
    props = props;
  });
</script>

{#if props !== undefined}
<div class="outer" style="padding: 5px; border-radius: 5px;">
  <Input type="select" style="display: inline; width: fit-content;" disabled={disabled} bind:value={props.type} on:change={handleSelectType}>
    {#each mappingTypes as type}
      <option id={type.id} value={type.text} selected={props.type === type.text}>
        {type.text}
      </option>
    {/each}
  </Input>
  <Button disabled={disabled} on:click={handleAddEquality} >add equality</Button>
  <Button disabled={disabled} on:click={handleChainMethods} >chain methods</Button>

  <Button class='float-right' disabled={props.is_arg ? false : true} on:click={handleDelete}>delete</Button>
  <Button class='float-right' disabled={disabled} on:click={handleWrap}>wrap</Button>
  <Button class='float-right' disabled={disabled} on:click={handleReset}>reset</Button>

  <div class="inner">
  {#if props.type === 'Field'}
  <!-- using HTML selects here to be able to bind value which will load the set option from JSON -->
    <select id={`table-select-${uniqID}`} class="form-control" style="width: 250px; display: inline;" disabled={disabled} bind:value={props.field.table} on:change|preventDefault={handleSelectTable}>
      <option>select table</option>
      {#if tableKey !== ""}
      {#each $optionsCache[tableKey] as ft}
        {#if allowedTables.length > 0}
          {#if allowedTables.includes(ft.table_id)}
          <option selected={ft.table_id === props.field.table_id} id={ft.table_id} value={ft.table_name}>{ft.table_name}</option>
          {/if}
        {:else}
        <option selected={ft.table_id === props.field.table_id} id={ft.table_id} value={ft.table_name}>{ft.table_name}</option>
        {/if}
      {/each}
      {/if}
    </select>
    <select id={`field-select-${uniqID}`} class="form-control" style="width: 250px; display: inline;" disabled={disabled} bind:value={props.field.column} on:change|preventDefault={handleSelectField}>
      <option>select field</option>
      {#if fieldKey !== ""}
      {#each $optionsCache[fieldKey] as ft}
        {#if allowedFields.length > 0}
          {#if allowedTables.includes(ft.field_id)}
          <option selected={ft.field_id === props.field.column_id} id={ft.field_id} value={ft.field_name}>{ft.field_name}</option>
          {/if}
        {:else}
        <option selected={ft.field_id === props.field.column_id} id={ft.field_id} value={ft.field_name}>{ft.field_name}</option>
        {/if}
      {/each}
      {/if}
    </select>
  {:else if props.type === 'Value'}
      <input id="value" placeholder="Value" bind:value={props.value} disabled={disabled}>
  {:else if props.type === 'Function'}
    <input class="function" placeholder="Function" bind:value={props.function} disabled={disabled}>

    <Button on:click={handleAddArgument} disabled={disabled}>Add argument</Button>
    <div class='func-args' >
      {#each props.args as arg, idx}
        {#if arg !== null}
        <div class="inner nest-item">
        <!-- move and delete buttons here so that parent can control child objects -->
          {#if idx > 0}
          <Button size="sm" style={moveBtnStyle} disabled={disabled} on:click={() => handleMoveArgUp(idx)}>move up</Button>
          {/if}
          <svelte:self bind:props={arg} />
          {#if idx < props.args.length-1}
          <Button size="sm" style={moveBtnStyle} disabled={disabled} on:click={() => handleMoveArgDown(idx)}>move down</Button>
          {/if}
        </div>
        {/if}
      {/each}
    </div>
  {:else }
    {alert("Type not supported")}
  {/if}
  <!-- method chaining -->
  {#if props.chain_methods.length > 0}
  <div style="border: 2px dashed orange; border-radius: 10px; padding: 5px;">
    {#each props.chain_methods as m, idx}
      <svelte:self bind:props={m} />
    {/each}
    <Button size="sm" on:click={handleChainMethod}>
    chain another
    </Button>
  </div>
  {/if}
  </div>
  <!-- equality -->
  {#if props.equality !== null}
  <div style="border: 2px dashed purple; border-radius: 10px; padding: 5px;">
    <select class="form-control" style="width: fit-content;" bind:value={props.equality.operator}>
      <option>select operator</option>
      <option value="==">==</option>
      <option value=">">&gt</option>
      <option value="<">&lt</option>
      <option value=">=">&gt=</option>
      <option value="<=">&lt=</option>
    </select>
    <svelte:self bind:props={props.equality.arg} />
  </div>
  {/if}
</div>
{/if}

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
    /* background-color: #52baeb; */
    /* margin: 10px; */

    /* padding: 10px; */
  }
  .outer {
    padding: 5px;
    margin: 8px;
    border: 1px solid black;
  }
  .func-args {
    border-color: black;
    border-style: dashed;
    border-width: 2px;
    border-radius: 15px;
    /* padding-top: 20px; */
    /* padding-bottom: 20px; */
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
    margin: 8px;
    border-color: black;
    border-style: solid;
    border-width: 1px;
    border-radius: 15px;
  }
</style>
