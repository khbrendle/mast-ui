<script>
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import { FieldTransform } from "./objects/FieldTransform.js";
  import { getTable, getField } from "./utils/api.js";
  import { Col, Row, Container, Input, CustomInput, Button } from "sveltestrap";

  const uniqID =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);

  export let disabled = false;
  $: disabled = disabled;

  export let props = new FieldTransform().newField();
  $: props = props;

  // console.log("object ", props, " is arg: ", props.is_arg);
  let moveBtnStyle = "margin: 5px auto; display: flex;";

  let mappingTypes = [
    { id: 0, text: "Field" },
    { id: 1, text: "Value" },
    { id: 2, text: "Function" }
  ];

  // let fieldOptions = [];
  // $: fieldOptions = fieldOptions;

  let tableOptions = [];
  $: tableOptions = tableOptions;

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
      props.alias
    );
  };

  const handleWrap = () => {
    props = new FieldTransform().newWrapper(props.is_arg, props.arg_index, props);
  };

  const handleMoveArgUp = idx => {
    console.log("moving up index ", idx);
    props = props.moveArgUp(idx);
  };

  const handleMoveArgDown = idx => {
    console.log("moving down index ", idx);
    props = props.moveArgDown(idx);
  };

  const handleDelete = () => {
    props = null;
  };

  const handleReset = () => {
    props = new FieldTransform().fromType(
      props.type,
      props.arg_index === null ? undefined : props.arg_index
    );
  };
  const handleSelectTable = e => {
    console.log("handling select table");
    // console.log(e);
    // props.field.table = e.target.value;
    props.field.table_id = e.target.options[e.target.selectedIndex].id;

    props.field.column = "";
    props.field.column_id = "";
    document.getElementById(`field-select-${uniqID}`).selectedIndex = 0;
    getField({ table_id: props.field.table_id }).then(data => {
      props.fieldOptions = data;
    });
  };
  const handleSelectField = e => {
    // console.log(e);
    // props.field.column = e.target.value;
    props.field.column_id = e.target.options[e.target.selectedIndex].id;
  };
  beforeUpdate(() => {
    // console.log("new props after update: ", props);
    var i = props.args.indexOf(null);
    // console.log(`removing arg at index ${i}`);
    if (i >= 0) {
      props.args.splice(i, 1);
      // props.args = props.args;
    }

    // this helps the select menus for table and field
    props = props;
  });

  onMount(() => {
    console.log("mouting ColumnMappingComponent");
    getTable().then(data => {
      // console.log(data);
      tableOptions = data;
    });

    if (props.field.column !== undefined && props.field.column !== "") {
      getField({ table_id: props.field.table_id }).then(data => {
        props.fieldOptions = data;
      });
    }
  });
</script>

<div class='outer'>
  <Input type="select" style="display: inline; width: fit-content;" disabled={disabled} bind:value={props.type} on:change={handleSelectType}>
    {#each mappingTypes as type}
      <option id={type.id} value={type.text} selected={props.type === type.text ? true : false}>
        {type.text}
      </option>
    {/each}
  </Input>

  <Button class='float-right' type='button' disabled={props.is_arg ? false : true} on:click={handleDelete}>delete</Button>
  <Button class='float-right' disabled={disabled} on:click={handleWrap}>wrap</Button>
  <Button class='float-right' disabled={disabled} on:click={handleReset}>refresh</Button>

  <div class="inner">
  {#if props.type === 'Field'}
  <!-- using HTML selects here to be able to bind value which will load the set option from JSON -->
    <select id={`table-select-${uniqID}`} class="form-control" style="width: 250px; display: inline;" disabled={disabled} bind:value={props.field.table} on:change|preventDefault={handleSelectTable}>
      <option>select table</option>
      {#each tableOptions as ft}
        <option id={ft.table_id} value={ft.table_name}>{ft.table_name}</option>
      {/each}
    </select>
    <select id={`field-select-${uniqID}`} class="form-control" style="width: 250px; display: inline;" disabled={disabled} bind:value={props.field.column} on:change|preventDefault={handleSelectField}>
      <option>select field</option>
      {#if props.fieldOptions !== undefined}
      {#each props.fieldOptions as ft}
        <option id={ft.field_id} value={ft.field_name}>{ft.field_name}</option>
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
    /* background-color: #52baeb; */
    /* margin: 10px; */
    padding: 10px;
  }
  .outer {
    /* margin: 5px; */
    margin: 8px;
    background-color: #52baeb;
    /* border-color: black;
                                                                                                                                                                                                                                                                                                              border-style: dashed;
                                                                                                                                                                                                                                                                                                              border-width: 2px; */
  }
  .func-args {
    border-color: black;
    border-style: dashed;
    border-width: 2px;
    border-radius: 15px;
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
    margin: 8px;
    border-color: black;
    border-style: solid;
    border-width: 1px;
    border-radius: 15px;
  }
</style>
