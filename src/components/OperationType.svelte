<script>
  import ColumnMappingComponent from "../ColumnMappingComponent.svelte";
  import { newRandomID } from "../utils/utils.js";
  import { Button, Input, Table, CustomInput, Collapse } from "sveltestrap";
  import { OperationType } from "../objects/OperationType.js";
  import { JoinItem } from "../objects/JoinItem.js";

  let uniqID = newRandomID();

  // used to keep track of opening/closing JoinItem objects in table
  let selected = [];
  $: selected = selected;

  // used to keep track on shown JoinItems
  let isOpen = [];

  // JoinItem props
  export let props = new OperationType();
  $: props = props;

  // this just controls closing the modal
  export let display = "none";
  $: display = display;

  const handleClose = () => {
    display = "none";
  };

  let disabled = true;
  const handleEdit = () => {
    disabled = !disabled;
  };
  var tmpCustomField = new JoinItem();
  const handleAddJoinItem = () => {
    // default to close JoinItem after addition
    isOpen = [...isOpen, false];
    props.join_on = [...props.join_on, tmpCustomField];
    // reset staging object for addition of another custome field
    tmpCustomField = new JoinItem();
  };
</script>

<div>
  <div id={`fieldSelectModal-${uniqID}`} class="modal" style="display:{display};">
    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
        <button class='modal-header-btn-close' type="button" on:click|preventDefault={handleClose}>x</button>
        <button type="button" on:click|preventDefault={handleEdit}>Edit</button>
      </div>
      <div class="modal-body">

      <!-- add modifier -->
      <select class="form-control" bind:value={props.modifier}>
        <option id="0" value="inner">Inner</option>
        <option id="1" value="left">Left</option>
        <option id="2" value="right">Right</option>
        <option id="3" value="outer">Outer</option>
        <option id="4" value="full">Full</option>
      </select>

      <Table>
        <thead>
          <tr>
            <th style="width: 20px;"></th>
            <th style="width: 50px;">operator</th>
            <!-- <th>print</th> -->
            <th>join fields</th>
          </tr>
        </thead>
        {#each props.join_on as j, i}
          <tr>
            <!-- empty field for add button -->
            <td></td>
            <td>
              <select class="form-control" bind:value={j.operator}>
                {#if i === 0}
                <option value=""></option>
                {/if}
                <option value="&">and</option>
                <option value="|">or</option>
              </select>
            </td>
            <td>
              <Button on:click={() => (isOpen[i] = !isOpen[i])}>
                open {j.entity.alias !== '' ? j.entity.alias : j.entity.field.column}
              </Button>
              <Collapse isOpen={isOpen[i]} >
                <ColumnMappingComponent bind:props={j.entity} />
              </Collapse>
            </td>
          </tr>
        {/each}
          <tr>
          <td>
            <Button on:click={handleAddJoinItem}>+</Button>
          </td>
          <td>
            <select class="form-control" bind:value={tmpCustomField.operator}>
              {#if props.join_on.length === 0}
              <option value=""></option>
              {/if}
              <option value="&">and</option>
              <option value="|">or</option>
            </select>
          </td>
          <td>
            <ColumnMappingComponent bind:props={tmpCustomField.entity}/>
          </td>
          </tr>
      </Table>
      <!-- <ColumnMappingComponent bind:props={props.Entity} /> -->

      </div>
    </div>
  </div>
</div>

<style>
  /* The Modal (background) */
  .modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  }

  /* Modal Content/Box */
  .modal-content {
    background-color: #fefefe;
    margin: auto; /* 15% from the top and centered */
    padding: 0;
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
  }
  /* The Close Button */
  .close-btn {
    color: #aaa;
    float: right;
    padding: 10px;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  .modal-header {
    padding: 2px 16px;
    margin-top: 8px;
    /* background-color: #5cb85c; */
    color: white;
  }
  /* Modal Body */
  .modal-body {
    padding: 2px 8px;
    margin-top: 10px;
  }
  .modal-header-btn-close {
    float: right;
  }
</style>
