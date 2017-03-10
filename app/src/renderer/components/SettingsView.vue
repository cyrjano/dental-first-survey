<template>
  <div class="container">
  <h1>Settings</h1>
  <form>
    <div class="form-group">
      <label for="exampleInputFile">Upload School CSV file</label>
      <input type="file" class="form-control-file" id="schoolsInputFile">
      <small id="fileHelp" class="form-text text-muted">
        CSV with list of Schools
         names and ids. This will remove previously uploaded file.
       </small>
    </div>
  </form>
  </div>

</template>
