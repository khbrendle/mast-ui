<!-- this component contains a table of columns which has a button to create/edit field source-to-target mappings -->

<script>
  import ColumnTransformModal from "./ColumnTransformModal.svelte";

  let displayModal = "none";
  $: displayModal = displayModal;

  let workingTransform = { field_id: null, transform: null };
  $: workingTransform = workingTransform;

  let data = [];
  $: data = data;

  function handleGetData() {
    var oReq = new XMLHttpRequest();
    oReq.onreadystatechange = () => {
      console.log(`state changed to ${oReq.readyState}`);
      switch (oReq.readyState) {
        case 4:
          if (oReq.status === 200) {
            data = JSON.parse(oReq.responseText);
            // console.log(data);
          } else {
            console.log(`reponse status ${this.status}: ${this.statusText}`);
          }
          break;
      }
    };
    oReq.open(
      "GET",
      "http://localhost:3000/v0/field?database_id=bp0ad6jipt375iprc3ug&table_id=bp0ad6jipt375iprc3v0",
      true
    );
    oReq.send();
  }

  function RowColor(idx) {
    switch (idx % 2) {
      case 1:
        return "#f0f0f0";
      case 0:
        return "#ffffff";
    }
  }

  function OpenModal(field) {
    displayModal = "block";
    console.log(field.field_id);
    // get mapping from database and pass to modal
    GetTransform(field.field_id);
    // save into workingTransform
  }

  function GetTransform(field_id) {
    fetch(`http://localhost:3000/v0/field/transform?&field_id=${field_id}`)
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        console.log(myJson);
        // only single object will be returned
        if (myJson[0] === undefined) {
          console.log("setting null");
          workingTransform = {
            field_id: field_id,
            transform: null
          };
        } else {
          workingTransform = myJson[0];
        }
        console.log(`response object: `);
        console.log(workingTransform);
      });
  }
</script>

<div>
  <button type="button" on:click|preventDefault={handleGetData}>Get Data</button>
  <table>
    <thead>
      <tr>
        <th>Database</th>
        <th>Table</th>
        <th>Field</th>
        <th>Transformation</th>
      </tr>
    </thead>
    {#each data as v, idx}
      <tr style="background:{RowColor(idx)};">
        <td style="background:{RowColor(idx)};">{v.database_name}</td>
        <td style="background:{RowColor(idx)};">{v.table_name}</td>
        <td style="background:{RowColor(idx)};">{v.field_name}</td>
        <td class="trans-button" style="background:{RowColor(idx)};">
          <button type="button" on:click|preventDefault={() => OpenModal(v)}>Open Transformation</button>
        </td>
      </tr>
    {/each}
  </table>
  <ColumnTransformModal bind:display={displayModal} bind:input={workingTransform}/>
</div>

<style>
  table,
  th,
  td {
    /* border: 1px solid black; */
    padding: 15px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th {
    background: #52baeb;
    height: 50px;
    text-align: left;
    vertical-align: center;
  }
  .trans-button {
    display: flex;
    align-items: center;
    justify-content: left;
  }
</style>
