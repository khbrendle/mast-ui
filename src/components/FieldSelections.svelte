<script>
  import { FieldTransform } from "../objects/FieldTransform.js";
  import ColumnMappingComponent from "../ColumnMappingComponent.svelte";
  import { beforeUpdate, afterUpdate } from "svelte";
  import { newRandomID } from "../utils/utils.js";
  import {
    Col,
    Row,
    Collapse,
    Button,
    Input,
    Table,
    CustomInput
  } from "sveltestrap";

  let uniqID = newRandomID();

  let addUnionBtnStyle =
    "width: 100%; height: 20px; font-size:10px; margin-right:6px;";

  let selectRowStyle = "padding: 5px 15px;";

  // fields gets the input with all fields from the table
  export let fields = [];
  $: fields = fields;
  let fieldsProcessed = false;
  let fieldsLen;

  // selected should be the final column selections/transformations
  // this will be bound from the parent
  export let selections = [];
  $: selections = selections;

  export let selected = [];
  $: selected = selected;

  // temp is where we convert to baseline FieldTransform obejct for each column
  let temp = [];
  $: temp = temp;

  // list of alllowed IDs
  export let allowedTables = [];
  $: allowedTables = allowedTables;
  export let allowedFields = [];
  $: allowedFields = allowedFields;

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

  beforeUpdate(() => {
    console.log(`id: ${uniqID}`);
    // console.log("fields", fields);
    // console.log("selected", selected);
    // console.log(`fieldsLen = ${fieldsLen}`);
    // console.log(`n fields = ${fields !== undefined ? fields.length : null}`);
    if (fields !== undefined) {
      if (fields.length !== fieldsLen) {
        // after wrapping, need to reset the temp object
        fieldsProcessed = false;
        temp = [];
      }

      if (!fieldsProcessed && fields.length > 0) {
        fieldsLen = fields.length;
        console.log("processing fields");
        fields.map((f, i) => {
          console.log(f instanceof FieldTransform);
          if (f instanceof FieldTransform) {
            temp[i] = f;
          } else {
            temp[i] = new FieldTransform(
              "Field",
              false,
              null,
              f.table_name,
              f.table_id,
              f.field_name,
              f.field_id,
              null,
              null,
              [],
              f.alias === "" || f.alias === undefined || f.alias === null // null should be the correct but handle all
                ? f.field_name
                : f.alias,
              [],
              null
            );
          }
        });
        // console.log("temp", temp);
        temp = temp;
        fieldsProcessed = true;
      }
    }

    // console.log("selected");
    // console.log(selected);
    // if (selected === undefined) {
    //   selected = Array(fields.length).fill(false);
    // }
    // console.log("temp");
    // console.log(temp);
    selections = selected
      .map((k, i) => {
        return k ? temp[i] : null;
      })
      .filter(x => {
        return x !== null;
      });
    // console.log("selections");
    // console.log(selections);
  });

  var tmpCustomField = new FieldTransform();
  const handleAddCustomField = () => {
    // add staged mapping to selections array
    temp = [...temp, tmpCustomField];
    fields = [...fields, tmpCustomField];
    // add true to selected array for new custom field
    selected = [...selected, true];
    // reset staging object for addition of another custome field
    tmpCustomField = new FieldTransform();
  };

  const handleOpenField = i => {
    console.log("editing field object", temp[i]);
    isOpen[i] = !isOpen[i];
  };

  const aliasInputStyle =
    "background: #eaeaea; border-radius: 7px; border: .5px solid #a0a0a0";
  const handleLogButton = () => {
    console.log("selected");
    console.log(selected);
  };
</script>

<div>
  <!-- <button type="button" on:click|preventDefault={handleLogButton}></button> -->
  <!-- <Button class="float-none add-union-btn" style={addUnionBtnStyle}>Select Fields</Button> -->
  <div id={`fieldSelectModal-${uniqID}`} class="modal" style="display:{display};">
    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
        <button class='modal-header-btn-close' type="button" on:click|preventDefault={handleClose}>x</button>
        <button type="button" on:click|preventDefault={handleEdit}>Edit</button>
        <!-- <button type="button" on:click|preventDefault={() => handleSubmit(input)}>Submit</button> -->
      </div>
      <div class="modal-body">
        <!-- <h1>{uniqID}</h1> -->
        <Table>
          <thead>
            <tr>
              <th style="width: 20px;"></th>
              <th style="width: 250px;">column</th>
              <th style="width: 50px;">select</th>
              <!-- <th>print</th> -->
              <th>customize</th>
            </tr>
          </thead>
          <tbody>
          {#each temp as f, i}
          <!-- this is a nice simple verison, just a button for each field to create the transformation -->
            <!-- <div>
              <Button on:click={() => (isOpen[i] = !isOpen[i])}>{f.field_name}</Button>
              <Collapse isOpen={isOpen[i]}>
                <ColumnMappingComponent />
              </Collapse>
            </div> -->

            <!-- table version should offer a level of simplicity for table building -->
            <tr>
              <td></td>
              <td>
                <input id={`field-alias-${uniqID}-${i}`} type="text" class="form-control-plaintext" bind:value={f.alias} style={aliasInputStyle} />
                <!-- {f.alias !== '' ? f.alias : f.field.column} -->
              </td>
              <td>
                <CustomInput
                  type="switch"
                  id={`exampleCustomSwitch-${uniqID}-${i}`}
                  name="customSwitch"
                  bind:checked={selected[i]}/>
              </td>

              <!-- <td>
                <Button on:click={() => {console.log(temp[i])}}>print</Button>
              </td> -->
              <td>
                <Button on:click={() => handleOpenField(i)}>{f.alias !== '' ? f.alias : f.field.column}</Button>
                <Collapse isOpen={isOpen[i]} >
                  <ColumnMappingComponent bind:props={temp[i]} bind:allowedTables={allowedTables}/>
                </Collapse>
              </td>
            </tr>
          {/each}
          <!-- this section if for creating custom field addition -->
          <tr>
            <td>
              <Button on:click={handleAddCustomField}>+</Button>
            </td>
            <td>
              <input id={`field-alias-${uniqID}-tmp`} type="text" class="form-control-plaintext" bind:value={tmpCustomField.alias} style={aliasInputStyle} />
            </td>
            <td></td>
            <td>
              <ColumnMappingComponent bind:props={tmpCustomField} bind:allowedTables={allowedTables}/>
            </td>
          </tr>
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
