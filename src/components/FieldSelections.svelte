<script>
  import { FieldTransform } from "../objects/FieldTransform.js";
  import ColumnMappingComponent from "../ColumnMappingComponent.svelte";
  import { afterUpdate } from "svelte";
  import { Col, Row, Collapse, Button, Table, CustomInput } from "sveltestrap";

  let addUnionBtnStyle =
    "width: 100%; height: 20px; font-size:10px; margin-right:6px;";

  let selectRowStyle = "padding: 5px 15px;";

  // fields gets the input with all fields from the table
  export let fields = [];
  $: fields = fields;
  let fieldsProcessed = false;

  // selected should be the final column selections/transformations
  // this will be bound from the parent
  export let selected = [];
  $: selected = selected;

  // temp is where we convert to baseline FieldTransform obejct for each column
  let temp = [];
  $: temp = temp;

  // isOpen is used to keep track of opening/collapsing individual transformations
  // per row of the table
  // could keep a previous state version of this to be able to determine which was opened
  let isOpen = Array(fields.length).fill(false);

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

  afterUpdate(() => {
    console.log("fieldsProcessed", fieldsProcessed);
    if (!fieldsProcessed && fields.length > 0) {
      fields.map((f, i) => {
        temp[i] = new FieldTransform(
          "Field",
          false,
          null,
          f.table_name,
          f.table_id,
          f.field_name,
          f.field_id
        );
      });
      console.log("temp", temp);
      temp = temp;
      fieldsProcessed = true;
    }
  });
</script>

<div>
  <!-- <Button class="float-none add-union-btn" style={addUnionBtnStyle}>Select Fields</Button> -->
  <div id="fieldSelectModal" class="modal" style="display:{display};">
    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
        <button class='modal-header-btn-close' type="button" on:click|preventDefault={handleClose}>x</button>
        <button type="button" on:click|preventDefault={handleEdit}>Edit</button>
        <!-- <button type="button" on:click|preventDefault={() => handleSubmit(input)}>Submit</button> -->
      </div>
      <div class="modal-body">
        <Table>
          <thead>
            <tr>
              <th>column</th>
              <th>select</th>
              <th>print</th>
              <th>customize</th>
            </tr>
          </thead>
          <tbody>
          {#each fields as f, i}
          <!-- this is a nice simple verison, just a button for each field to create the transformation -->
            <!-- <div>
              <Button on:click={() => (isOpen[i] = !isOpen[i])}>{f.field_name}</Button>
              <Collapse isOpen={isOpen[i]}>
                <ColumnMappingComponent />
              </Collapse>
            </div> -->

            <!-- table version should offer a level of simplicity for table building -->
            <tr>
              <td>{f.field_name}</td>
              <td>
                <CustomInput
                  type="switch"
                  id={`exampleCustomSwitch-${f.field_id}`}
                  name="customSwitch"
                  bind:checked={selected[i]}/>
              </td>
              <td>
                <Button on:click={() => {console.log(temp[i])}}>print</Button>
              </td>
              <td>
                <Button on:click={() => (isOpen[i] = !isOpen[i])}>{f.field_name}</Button>
                <Collapse isOpen={isOpen[i]}>
                <ColumnMappingComponent bind:props={temp[i]}/>
                </Collapse>
              </td>
            </tr>
            <tr>
              <!-- <Button on:click={() => {console.log(`checked: ${checked}`, fields)}}> print </Button> -->
              {selected[i]}
            </tr>
          {/each}
        </tbody>
      </Table>
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
