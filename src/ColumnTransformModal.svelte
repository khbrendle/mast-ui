<script>
  // import ColumnTransform from "./ColumnTransform.svelte";
  import { beforeUpdate, afterUpdate } from "svelte";
  import ColumnMappingComponent from "./ColumnMappingComponent.svelte";
  import { ColumnMappingValue } from "./objects.js";

  export let input = { field_id: null, transform: null };
  $: input.transform =
    input.transform === null
      ? new ColumnMappingValue()
      : new ColumnMappingValue().fromObject(input.transform);

  export let display = "none";
  $: display = display;

  function handleClose() {
    display = "none";
    input = { field_id: null, transform: null };
  }

  let disabled = true;
  function handleEdit() {
    disabled = !disabled;
  }

  async function saveTransform(data) {
    // Default options are marked with *
    const response = await fetch("http://localhost:3000/v0/field/transform", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      // redirect: 'follow', // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(input) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }

  function handleSubmit(input) {
    saveTransform(input).then(data => {
      console.log(data); // JSON data parsed by `response.json()` call
    });
    // close modal
    handleClose();
  }
</script>

<!-- The Modal -->
<div id="myModal" class="modal" style="display:{display};">

	<!-- Modal content -->
	<div class="modal-content">
    <div class="modal-header">
      <button class='modal-header-btn-close' type="button" on:click|preventDefault={handleClose}>x</button>
      <button type="button" on:click|preventDefault={handleEdit}>Edit</button>
      <button type="button" on:click|preventDefault={() => handleSubmit(input)}>Submit</button>
    </div>
    <div class="modal-body">
      <!-- <ColumnTransform /> -->
      <ColumnMappingComponent bind:disabled={disabled} bind:props={input.transform}/>
      <pre>
      {#if input !== null}
        {input.transform.toString(null, 2)}
      {/if}
      </pre>
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
