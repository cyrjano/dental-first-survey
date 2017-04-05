<template>
  <div class="loader"></div>
</template>
<style>
.loader {
    border: 0.4em solid rgba(200,200,255,1.0); /* Light grey */
    border-top-color: rgba(200,200,255,0.5); /* Blue */
    border-radius: 50%;
    width: 1.5em;
    height: 1.5em;
    animation: spin 2s ease infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
