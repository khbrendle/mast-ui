<script>
  import { onMount, afterUpdate } from "svelte";
  import { ColumnMappingValue } from "./objects.js";
  import { Input, Button, Row, Col } from 'sveltestrap';

  export let props = new ColumnMappingValue().newField();
  $: props = props;

  // export let isArg = false;
  console.log("object ", props, " is arg: ", props.isArg);
  // export let argIndex = null;

  let mappingTypes = [
    { id: 1, text: "Field" },
    { id: 2, text: "Value" },
    { id: 3, text: "Function" }
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
    props = new ColumnMappingValue().newWrapper(props);
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

  afterUpdate(() => {
    console.log("new props after update: ", props);
  });
</script>

<div class='outer'>
  <!-- <p>argIndex: {props.argIndex}</p> -->
  <Row class="justify-content-between">
    <Col class="col-3">
      <Input type="select" class='type-select' bind:value={props.type} on:change={handleSelectType}>
        {#each mappingTypes as type}
          <option id={type.id} value={type.text}>
            {type.text}
          </option>
        {/each}
      </Input>
    </Col>
    <Col class="col-1" style="text-align: right;">
      <Button class='wrap-button' type='button' on:click={handleWrap}>Wrap</Button>
    </Col>
  </Row>

  <!-- {#if props.isArg}
    <button class='up-arrow' type='button' on:click|preventDefault={() => handleMoveArgUp(argIndex)}>&#8593;</button>
  {/if} -->
  <div class="inner">
  {#if props.type === 'Field'}
    <Input class="field_table" placeholder='Table' bind:value={props.field.table} />
    <Input class="field_column" placeholder='Column' bind:value={props.field.column} />
  {:else if props.type === 'Value'}
      <Input id="value" placeholder="Value" bind:value={props.value} />
  {:else if props.type === 'Function'}
    <Input class="function" placeholder="Function" bind:value={props.function} />

    <Button type='button' on:click={handleAddArgument}>Add argument</Button>
    <div class='func-args'>
      {#each props.args as arg, idx}
        <button class='up-arrow' type='button' on:click|preventDefault={() => handleMoveArgUp(idx)}>&#8593;</button>
        <svelte:self bind:props={arg} />
        <button class='down-arrow' type='button' on:click|preventDefault={() => handleMoveArgDown(idx)}>&#8595;</button>
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

			/* .type-select {
			  position: relative;
			  left: 10px;
			  top: 10px;
			} */

      .outer {
        background-color: #fff;
        padding: 3em;
        /* margin: 5px;
        border-radius: 12px; */
      }

			.inner {
			  /* display: flex; */
			  /* padding: 1em; */
        /* box-shadow: 2px 2px 10px 0 rgba(0,0,0,0.2); */
			}

			.func-args {
        margin: 1.5em;
        border-radius: 12px;
        padding: 1em 0 1em 3em;
        box-shadow: 2px 2px 10px 0 rgba(0,0,0,0.2);
			}

			.wrap-button {
			  /* float: right; */
			  margin: 5px;
			}
			.up-arrow {
			  position: relative;
			  top: 37px;
			  left: 50%;
			  height: 20px;
			  line-height: 5px;
			}
			.down-arrow {
			  position: relative;
			  bottom: 27px;
			  left: 50%;
			  height: 20px;
			  line-height: 5px;
			}
</style>
