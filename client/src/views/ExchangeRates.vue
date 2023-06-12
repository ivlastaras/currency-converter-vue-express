<template>
  <h2 style="text-decoration:underline;">Exchange Rates</h2>
  <div v-if="exchangerates.length">
    <table class="exchangerates-table">
      <thead>
        <tr>
          <th>Base</th>
          <th>Target</th>
          <th>Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="exchangerate in exchangerates" class="active-row">
          <td>{{ exchangerate.base }}</td>
          <td>{{ exchangerate.target }}</td>
          <td>{{ exchangerate.rate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    <p>Loading exchangerates...</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      exchangerates: []
    }
  },
  mounted() {
    fetch('http://localhost:8000/exchangerates')
      .then(res => res.json())
      .then(data => this.exchangerates = data.data)
      .catch(err => console.log(err.message))
  }

}
</script>

<style>
.exchangerates-table {
  margin-left: auto;
  margin-right: auto;
  border-collapse: collapse;
  font-size: 1.2em;
  font-family: sans-serif;
  min-width: 800px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.exchangerates-table thead tr {
  background-color: #191970;
  color: #ffffff;
  margin-left: auto;
  margin-right: auto;
}

.exchangerates-table th,
.exchangerates-table td {
  padding: 12px 15px;
  margin-left: auto;
  margin-right: auto;
}

.exchangerates-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.exchangerates-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.exchangerates-table tbody tr:last-of-type {
  border-bottom: 2px solid #4169E1;
}

.exchangerates-table tbody tr.active-row {
  font-weight: bold;
  color: #4169E1;
}
</style>