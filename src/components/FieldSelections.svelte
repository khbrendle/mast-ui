<script>
  import ColumnMappingComponent from "../ColumnMappingComponent.svelte";

  import { Col, Row, Container, Collapse, Button } from "sveltestrap";

  let addUnionBtnStyle =
    "width: 100%; height: 20px; font-size:10px; margin-right:6px;";

  let selectRowStyle = "padding: 5px 15px;";

  export let fields = [];

  export let display = "none";
  $: display = display;

  const handleClose = () => {
    display = "none";
  };

  let disabled = true;
  const handleEdit = () => {
    disabled = !disabled;
  };

  let isOpen = Array(fields.length).fill(false);
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
      {#each fields as f, i}
        <div>
          <Button on:click={() => (isOpen[i] = !isOpen[i])}>{f.field_name}</Button>
          <p style="display: inline;">F.concat_ws("_", first_name, last_name)</p>
          <Collapse isOpen={isOpen[i]}>
            <!-- <p>create transformation here</p> -->
            <ColumnMappingComponent />
          </Collapse>
        </div>
        <!-- <Row style={selectRowStyle}>
          <Row>
            <Col>
              <Button on:click={() => (isOpen[i] = !isOpen[i])}>{f.field_name}</Button>
            </Col>
            <p>F.concat_ws("_", first_name, last_name)</p>
          </Row>
          <Row>
            <Collapse isOpen={isOpen[i]}>
              <p>create transformation here</p>
            </Collapse>
          </Row>
        </Row> -->
      {/each}

        <!-- <ColumnTransform /> -->
        <!-- <ColumnMappingComponent bind:disabled={disabled} bind:props={input.transform}/> -->
        <!-- <pre>
        {#if input !== null}
          {input.transform.toString(null, 2)}
        {/if}
        </pre> -->
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
