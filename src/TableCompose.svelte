<script>
  import { newDataSource, newDataSourceQuery } from "./objects/DataSource.js";
  import { newDataSourceOperation } from "./objects/DataSourceOperation.js";
  import { syntaxHighlight } from "./utils/utils.js";
  import { Col, Container, Row, Button, Input, Label } from "sveltestrap";
  import DataLocation from "./components/DataLocation.svelte";

  let rowStyle = "border-style: dashed;border-color: black; border-width: 1px";
  let addJoinBtnStyle = "font-size: 10px; height: 80px; margin-bottom: 8px;";
  let addUnionBtnStyle = "width: 100%; height: 20px; font-size:10px";
  // import { newDataSource } from "./objects/DataSource.js";
  // import { Col, Container, Row, Button, Input, Label } from "sveltestrap";
  import DataSource from "./components/DataSource.svelte";
  import DataSourceOperation from "./components/DataSourceOperation.svelte";

  let props = newDataSource("table");
  $: props = props;

  const logObj = () => {
    console.log(props);
  };
  const handleAddUnion = () => {
    console.log("adding union");
    props = props.setType("query");

    props.operations = [
      ...props.operations,
      newDataSourceOperation("union", newDataSource("query"))
    ];
  };
  const handleAddJoin = () => {
    console.log("adding join");
  };
  const handleMakeQuery = () => {
    console.log("making query");
    props = newDataSourceQuery(props);
  };
</script>

<div>
  <!-- <button type="button" on:click={logObj}>log object</button> -->
  <div>
  <Button title="Make query" style="font-size:12px" on:click={handleMakeQuery}>Make query</Button>
    <Container style="max-width: 95%">
      <Row style="padding: 8px; border: 1px dashed black; overflow: scroll; flex-wrap: nowrap;">
        <!-- start data source -->
        <!-- <Button style="width: 100%; height: 30px; font-size:12px; margin-top: 5px;">All Field Selections</Button> -->
              <DataSource bind:props={props} />
        <!-- stop data source -->
        <!-- <Button class="float-right add-join-btn" style={addJoinBtnStyle} title="Add Join" on:click={handleAddJoin}>add<br>join</Button> -->
        <!-- this button should split the black box -->
        <!-- <Button class="float-right" style="margin-left: 6px; margin-bottom: 0; font-size:10px" on:click={handleAddJoin}>add<br>join</Button>
        <Button class="float-none" style="width: 100%; margin: 6px 0px 0px 0px; height: 20px; font-size:10px" on:click={handleAddUnion}>add union</Button> -->
      </Row>
    </Container>
    <hr>
    <pre>
      {@html syntaxHighlight(props.toString())}
    </pre>
    <hr>
    <Container>
      <Row style="padding: 10px; border-style: dashed; border-color: black; border-width: 1px">
        <Col style="padding: 10px;border-style: dashed;border-color: blue; border-width: 1px">
          <Row>
            <Col style="margin: 15px; border-style: dashed;border-color: red; border-width: 1px">table_1</Col>
          </Row>
          <Row>
            <Col style="margin: 15px; border-style: dashed;border-color: red; border-width: 1px">table_2</Col>
          </Row>
          <Row>
            <Col style="margin: 15px; border-style: dashed;border-color: red; border-width: 1px">table_3</Col>
          </Row>
        </Col>
          <Col style="padding: 10px;border-style: dashed;border-color: blue; border-width: 1px">
          table_4
          </Col>
      </Row>
    </Container>
  </div>
</div>

<style>
  .table-object {
    border-color: black;
    border-style: dashed;
    border-width: 1px;
    height: 200px;
    width: 200px;
  }

  .co {
    flex-basis: unset;
  }
</style>
